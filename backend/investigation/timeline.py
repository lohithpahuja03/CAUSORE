"""
CAUSORE Incident Timeline Engine
Strictly adhering to BRAIN.md Principle 1, Principle 6, and Stage 7.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from backend.parsers.base import ParsedRecord


class TimelineSegment(BaseModel):
    phase: str # pre_incident, active_window, post_incident
    start_time: str
    end_time: str
    event_count: int
    error_count: int
    warning_count: int


class TimelineSummary(BaseModel):
    investigation_id: str
    total_events: int
    start_time: str
    end_time: str
    segments: List[TimelineSegment]
    service_distribution: Dict[str, int]
    level_distribution: Dict[str, int]
    top_error_fingerprints: Dict[str, int]
    ordered_events: List[ParsedRecord]


class TimelineEngine:
    """Processes normalized events into chronological timelines with window segmentation."""

    def build_timeline(
        self,
        investigation_id: str,
        events: List[ParsedRecord],
        incident_start: str,
        incident_end: Optional[str] = None
    ) -> TimelineSummary:
        # Sort chronologically by UTC ISO-8601 string
        sorted_events = sorted(events, key=lambda e: e.timestamp)
        if not sorted_events:
            return TimelineSummary(
                investigation_id=investigation_id,
                total_events=0,
                start_time=incident_start,
                end_time=incident_end or incident_start,
                segments=[],
                service_distribution={},
                level_distribution={},
                top_error_fingerprints={},
                ordered_events=[]
            )

        earliest_time = sorted_events[0].timestamp
        latest_time = sorted_events[-1].timestamp
        effective_end = incident_end or latest_time

        # Window Segmentation
        pre_events: List[ParsedRecord] = []
        active_events: List[ParsedRecord] = []
        post_events: List[ParsedRecord] = []

        service_dist: Dict[str, int] = {}
        level_dist: Dict[str, int] = {}
        fingerprint_dist: Dict[str, int] = {}

        for evt in sorted_events:
            # Distribution counts
            service_dist[evt.service] = service_dist.get(evt.service, 0) + 1
            level_dist[evt.level] = level_dist.get(evt.level, 0) + 1
            if evt.level in ["ERROR", "FATAL"] and evt.fingerprint:
                fingerprint_dist[evt.fingerprint] = fingerprint_dist.get(evt.fingerprint, 0) + 1

            # Window assignment
            if evt.timestamp < incident_start:
                pre_events.append(evt)
            elif evt.timestamp <= effective_end:
                active_events.append(evt)
            else:
                post_events.append(evt)

        def make_segment(phase_name: str, seg_events: List[ParsedRecord], def_start: str, def_end: str) -> TimelineSegment:
            s_time = seg_events[0].timestamp if seg_events else def_start
            e_time = seg_events[-1].timestamp if seg_events else def_end
            errs = sum(1 for e in seg_events if e.level in ["ERROR", "FATAL"])
            warns = sum(1 for e in seg_events if e.level == "WARN")
            return TimelineSegment(
                phase=phase_name,
                start_time=s_time,
                end_time=e_time,
                event_count=len(seg_events),
                error_count=errs,
                warning_count=warns
            )

        segments = [
            make_segment("pre_incident", pre_events, earliest_time, incident_start),
            make_segment("active_window", active_events, incident_start, effective_end),
            make_segment("post_incident", post_events, effective_end, latest_time)
        ]

        # Top 5 recurring error fingerprints
        top_fps = dict(sorted(fingerprint_dist.items(), key=lambda x: x[1], reverse=True)[:5])

        return TimelineSummary(
            investigation_id=investigation_id,
            total_events=len(sorted_events),
            start_time=earliest_time,
            end_time=latest_time,
            segments=segments,
            service_distribution=service_dist,
            level_distribution=level_dist,
            top_error_fingerprints=top_fps,
            ordered_events=sorted_events
        )
