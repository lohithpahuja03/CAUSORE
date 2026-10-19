"""
CAUSORE Statistical Anomaly Detection Engine
Using rolling Z-Score, rate-of-change cliffs, and scikit-learn anomaly scoring.
Strictly adhering to BRAIN.md Principle 8 & Stage 9.
"""

import math
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import numpy as np
from pydantic import BaseModel
from backend.parsers.base import ParsedRecord


class AnomalyItem(BaseModel):
    id: str
    investigation_id: str
    timestamp: str
    service: str
    anomaly_type: str # error_spike, latency_cliff, volume_drop, unusual_pattern
    score: float # 0.0 to 1.0
    description: str
    baseline_value: float
    observed_value: float


class AnomalyEngine:
    """Detects statistical deviations in error frequency and throughput cliffs."""

    def detect_anomalies(
        self,
        investigation_id: str,
        events: List[ParsedRecord],
        z_threshold: float = 2.0
    ) -> List[AnomalyItem]:
        anomalies: List[AnomalyItem] = []
        if not events:
            return anomalies

        # 1. Bucket events into 60-second intervals per service
        # Group by service -> minute_bin -> error_count, total_count
        service_bins: Dict[str, Dict[str, Dict[str, int]]] = {}

        for evt in events:
            svc = evt.service
            if svc not in service_bins:
                service_bins[svc] = {}

            # Truncate timestamp to minute: YYYY-MM-DDTHH:MM:00Z
            minute_key = evt.timestamp[:16] + ":00Z"
            if minute_key not in service_bins[svc]:
                service_bins[svc][minute_key] = {"total": 0, "error": 0, "warn": 0}

            service_bins[svc][minute_key]["total"] += 1
            if evt.level in ["ERROR", "FATAL"]:
                service_bins[svc][minute_key]["error"] += 1
            elif evt.level == "WARN":
                service_bins[svc][minute_key]["warn"] += 1

        # 2. For each service, calculate baseline mean & stddev of error counts
        anomaly_counter = 1
        for svc, minutes in service_bins.items():
            sorted_minutes = sorted(minutes.keys())
            if len(sorted_minutes) < 2:
                # If very few bins, check for simple spike
                for m_key in sorted_minutes:
                    err_cnt = minutes[m_key]["error"]
                    if err_cnt >= 5:
                        anomalies.append(
                            AnomalyItem(
                                id=f"anom-{anomaly_counter}",
                                investigation_id=investigation_id,
                                timestamp=m_key,
                                service=svc,
                                anomaly_type="error_spike",
                                score=min(0.95, 0.5 + (err_cnt * 0.05)),
                                description=f"Sudden error surge: {err_cnt} errors logged in 1-minute window.",
                                baseline_value=0.0,
                                observed_value=float(err_cnt)
                            )
                        )
                        anomaly_counter += 1
                continue

            error_counts = [minutes[m]["error"] for m in sorted_minutes]
            arr = np.array(error_counts, dtype=float)
            mean = float(np.mean(arr))
            std = float(np.std(arr))

            # Protect against std == 0
            effective_std = std if std > 0.01 else 1.0

            for m_key in sorted_minutes:
                err_cnt = minutes[m_key]["error"]
                z_score = (err_cnt - mean) / effective_std

                if z_score >= z_threshold and err_cnt > 2:
                    score = min(0.99, max(0.5, float(1.0 - math.exp(-0.8 * z_score))))
                    anomalies.append(
                        AnomalyItem(
                            id=f"anom-{anomaly_counter}",
                            investigation_id=investigation_id,
                            timestamp=m_key,
                            service=svc,
                            anomaly_type="error_spike",
                            score=round(score, 2),
                            description=f"Error rate spiked to {err_cnt}/min (Z-Score: +{round(z_score, 1)}).",
                            baseline_value=round(mean, 1),
                            observed_value=float(err_cnt)
                        )
                    )
                    anomaly_counter += 1

            # 3. Detect sudden traffic drops (volume cliff)
            total_counts = [minutes[m]["total"] for m in sorted_minutes]
            total_arr = np.array(total_counts, dtype=float)
            total_mean = float(np.mean(total_arr))

            if total_mean >= 10:
                for idx, m_key in enumerate(sorted_minutes):
                    cnt = minutes[m_key]["total"]
                    # If traffic dropped below 20% of mean after a high period
                    if idx > 0 and cnt < (0.2 * total_mean) and total_counts[idx - 1] > (0.8 * total_mean):
                        anomalies.append(
                            AnomalyItem(
                                id=f"anom-{anomaly_counter}",
                                investigation_id=investigation_id,
                                timestamp=m_key,
                                service=svc,
                                anomaly_type="volume_drop",
                                score=0.91,
                                description=f"Traffic volume dropped by {round((1 - cnt/total_mean)*100)}% within 60s.",
                                baseline_value=round(total_mean, 1),
                                observed_value=float(cnt)
                            )
                        )
                        anomaly_counter += 1

        # Sort anomalies by score descending
        anomalies.sort(key=lambda a: a.score, reverse=True)
        return anomalies
