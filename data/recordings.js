// =============================================================================
//  RCScoring  -  recording table
//  이 파일만 고치면 페이지 전체가 따라 바뀝니다. HTML 은 건드릴 필요 없습니다.
// =============================================================================
//
//  scenario  SCENARIOS 의 코드 ("S1".."S5", "A1".."A3").  "" 이면 Unassigned.
//  run       "baseline"  = 승차감 지표 없이 주행 (w_comfort = 0)
//            "comfort"   = 승차감 인지 모델 적용 주행
//            ""          = 미분류
//  speed     목표 속도 [km/h].  숫자 또는 "".
//  side      "left" | "right" | ""     (좌/우 반복 구분)
//  note      카드에 한 줄로 붙는 메모.  실패 사유 등.  "" 이면 안 나옴.
//  hidden    true 로 두면 페이지에서 제외됩니다.
//
//  예)  { id: "MAN_20260911_112010", ..., scenario: "S1", run: "baseline",
//          speed: 30, side: "left", note: "", hidden: false },

const SCENARIOS = [
  { code: "S1", group: "Structured",
     title: "Obstacle-zone avoidance",
     detail: "Single obstacle field crossed once to the left and once to the right.",
     speeds: "15 / 30 / 50" },
  { code: "S2", group: "Structured",
     title: "Zigzag obstacle avoidance",
     detail: "Alternating obstacles forcing a left-right-left weave.",
     speeds: "15 / 30 / 50" },
  { code: "S3", group: "Structured",
     title: "Consecutive obstacle avoidance",
     detail: "Obstacles spaced so that one avoidance manoeuvre runs into the next.",
     speeds: "15 / 30 / 50" },
  { code: "S4", group: "Structured",
     title: "Choice between two obstacles",
     detail: "Two obstacles of different height, both unavoidable. The planner has to pick the lower one.",
     speeds: "15 / 30 / 50" },
  { code: "S5", group: "Structured",
     title: "Obstacle-zone avoidance through a turn",
     detail: "Same obstacle field, entered on a left and on a right turn.",
     speeds: "15 / 30 / 50" },
  { code: "A1", group: "Additional",
     title: "Pothole avoidance",
     detail: "Narrow walled corridor. Low speed only, the walls leave little lateral room.",
     speeds: "10 / 15" },
  { code: "A2", group: "Additional",
     title: "Obstacle narrower than the vehicle",
     detail: "The obstacle fits between the wheels, so the correct behaviour is not to avoid it.",
     speeds: "15 / 30 / 50" },
  { code: "A3", group: "Additional",
     title: "Obstacle at the roundabout",
     detail: "Obstacle placed on the roundabout approach.",
     speeds: "15 / 30" },
];

const RECORDINGS = [
  // 아직 비어 있습니다. RCScoring 실차 영상을 web/videos/ 와 web/posters/ 에
  // 넣고, 파일마다 아래 형식으로 한 줄씩 추가하세요.
  //
  // { id: "<videos/<id>.mp4 의 id>", clock: "11:20:10", seconds: 60,
  //   scenario: "S1", run: "baseline", speed: 30, side: "left",
  //   note: "", hidden: false },
];
