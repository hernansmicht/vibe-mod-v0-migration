"use client"

import Image from 'next/image';
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Blood pattern types with forensic data
const BLOOD_PATTERNS = {
  "passive-drops": {
    name: "Passive Drops",
    description: "Small, round, spaced dots",
    implication: "Blood dripped from a stationary position",
    feedback: "Correct. Passive drops indicate the source was stationary and bleeding from a fixed height.",
  },
  "cast-off": {
    name: "Cast-Off",
    description: "Arced lines or dotted streaks",
    implication: "Came off a swinging object (e.g., weapon)",
    feedback: "Correct. Cast-off patterns result from blood being flung from a moving object in an arc.",
  },
  "impact-spatter": {
    name: "Impact Spatter",
    description: "Fine mist, scattered tiny droplets",
    implication: "Caused by blunt-force trauma",
    feedback: "Correct. Impact spatter creates fine droplets when blood is forcibly projected from the source.",
  },
  swipe: {
    name: "Swipe",
    description: "Elongated smears with motion direction",
    implication: "Something bloody was dragged/moved",
    feedback: "Correct. Swipe patterns show lateral movement of a bloody object across a surface.",
  },
  wipe: {
    name: "Wipe",
    description: "Disturbed stains over blood",
    implication: "Someone tried to erase or manipulate evidence",
    feedback: "Correct. Wipe patterns indicate an attempt to clean or alter existing bloodstains.",
  },
  void: {
    name: "Void",
    description: "Clean area amid blood spray",
    implication: "An object or person blocked the pattern",
    feedback: "Correct. Void patterns show where an obstruction prevented blood from reaching the surface.",
  },
  "drip-trail": {
    name: "Drip Trail",
    description: "Linear path of drops",
    implication: "Victim or suspect moved while bleeding",
    feedback: "Correct. Drip trails indicate movement of a bleeding individual.",
  },
  "arterial-spray": {
    name: "Arterial Spray",
    description: "Pulsing arcs, heavy projection",
    implication: "Major artery struck—victim alive and moving",
    feedback: "Correct. Arterial spray shows rhythmic patterns consistent with heartbeat and blood pressure.",
  },
}

// Crime scene cases
const CRIME_CASES = {
  "suburban-shooting": {
    id: "suburban-shooting",
    title: "The Suburban Shooting",
    description:
      "A home invasion turned deadly. Analyze the blood patterns to reconstruct the sequence of events from the initial entry to the final moments.",
    difficulty: "Beginner",
    location: "Suburban Home",
    status: "Available",
    image: "/suburban-scene.png",
    analysisPoints: [
      { id: 1, x: 78, y: 22, pattern: "impact-spatter", description: "Fine droplets near the entrance" },
      { id: 2, x: 68, y: 58, pattern: "passive-drops", description: "Small pools of blood on the floor by the door" },
      { id: 3, x: 35, y: 65, pattern: "drip-trail", description: "Linear path of drops leading into the house" },
      { id: 4, x: 45, y: 80, pattern: "passive-drops", description: "Large pool of blood where victim collapsed" },
      { id: 5, x: 70, y: 75, pattern: "impact-spatter", description: "Scattered tiny droplets around the victim's head" },
    ],
    timelineArrows: [
      { id: 1, x: 20, y: 75, event: "Killer positioned inside, awaiting victim's entry", direction: "↓" },
      { id: 2, x: 70, y: 30, event: "Victim opens door, shot in stomach", direction: "←" },
      { id: 3, x: 30, y: 60, event: "Victim stumbles further into the house", direction: "↙" },
      { id: 4, x: 45, y: 75, event: "Victim collapses to the floor", direction: "↓" },
      { id: 5, x: 60, y: 65, event: "Killer delivers fatal headshot", direction: "↓" },
      { id: 6, x: 50, y: 45, event: "Killer flees the scene", direction: "↗" },
    ],
    deductionQuestions: [
      {
        question: "What was the initial injury location?",
        options: ["Head", "Chest", "Stomach", "Leg"],
        correct: 2,
        explanation:
          "The initial blood patterns (impact spatter and passive drops) at the entry point, followed by a drip trail, indicate a wound that caused bleeding while the victim was still mobile, consistent with a stomach injury.",
      },
      {
        question: "What does the drip trail indicate about the victim?",
        options: ["Victim was dragged", "Victim moved after injury", "Victim was stationary"],
        correct: 1,
        explanation:
          "A drip trail is formed by drops of blood falling from a moving object or person, indicating the victim was mobile after sustaining the initial injury.",
      },
      {
        question: "What caused the final blood spatter around the victim's head?",
        options: ["Blunt force trauma", "Stabbing", "Second gunshot"],
        correct: 2,
        explanation:
          "The presence of additional impact spatter around the head, after the victim had already fallen, suggests a second, distinct forceful event, consistent with a fatal headshot.",
      },
    ],
  },
  "bedroom-assault": {
    id: "bedroom-assault",
    title: "The Bedroom Assault",
    description:
      "A violent confrontation in a residential bedroom. Multiple blood patterns suggest a complex sequence of events.",
    difficulty: "Intermediate",
    location: "Residential Bedroom",
    status: "Available",
    image: "/crime-scene.png",
    analysisPoints: [
      { id: 1, x: 25, y: 60, pattern: "drip-trail", description: "Trail of drops leading from door" },
      { id: 2, x: 70, y: 40, pattern: "arterial-spray", description: "Arcing pattern on wall" },
      { id: 3, x: 60, y: 80, pattern: "void", description: "Clean area within blood pool" },
      { id: 4, x: 15, y: 45, pattern: "swipe", description: "Smear pattern on door frame" },
    ],
    timelineArrows: [
      { id: 1, x: 20, y: 50, event: "Victim enters the room through the door", direction: "→" },
      { id: 2, x: 35, y: 55, event: "Initial confrontation occurs near the entrance", direction: "↗" },
      { id: 3, x: 70, y: 35, event: "Victim is struck, causing arterial bleeding", direction: "↑" },
      { id: 4, x: 50, y: 65, event: "Victim moves toward the bed while bleeding", direction: "→" },
      { id: 5, x: 60, y: 75, event: "Final impact occurs on the floor", direction: "↓" },
      { id: 6, x: 25, y: 70, event: "Perpetrator attempts to clean evidence", direction: "↻" },
      { id: 7, x: 15, y: 40, event: "Perpetrator exits, leaving additional traces", direction: "←" },
    ],
    deductionQuestions: [
      {
        question: "What type of weapon was likely used?",
        options: ["Blunt object", "Sharp blade", "Projectile weapon"],
        correct: 0,
        explanation: "Impact spatter and arterial spray patterns indicate blunt force trauma to a major vessel.",
      },
      {
        question: "Was the victim upright or grounded when the major injury occurred?",
        options: ["Upright and mobile", "Already on the ground", "Seated position"],
        correct: 0,
        explanation:
          "Arterial spray height and angle indicate the victim was standing when the major artery was severed.",
      },
      {
        question: "Is there evidence of scene tampering?",
        options: ["No tampering evident", "Minor cleanup attempt", "Extensive staging"],
        correct: 1,
        explanation:
          "Wipe patterns and void areas suggest someone attempted to clean or manipulate the blood evidence.",
      },
    ],
  },
  "office-incident": {
    id: "office-incident",
    title: "The Office Incident",
    description:
      "A workplace stabbing in a corporate office. The victim was attacked while working late, leaving behind critical forensic evidence.",
    difficulty: "Expert",
    location: "Corporate Office",
    status: "Available",
    image: "/office-scene.png",
    analysisPoints: [
      { id: 1, x: 65, y: 25, pattern: "impact-spatter", description: "Fine droplets on wall above desk" },
      { id: 2, x: 45, y: 35, pattern: "cast-off", description: "Linear pattern on chair back" },
      { id: 3, x: 55, y: 75, pattern: "passive-drops", description: "Large blood pool near body outline" },
      { id: 4, x: 70, y: 80, pattern: "wipe", description: "Disturbed blood pattern on floor" },
    ],
    timelineArrows: [
      { id: 1, x: 30, y: 20, event: "Victim working late at desk, unaware of approaching threat", direction: "→" },
      { id: 2, x: 40, y: 30, event: "Attacker approaches from behind with knife", direction: "↘" },
      { id: 3, x: 50, y: 35, event: "Initial stabbing occurs while victim is seated", direction: "↓" },
      { id: 4, x: 45, y: 50, event: "Victim attempts to stand and defend, creating cast-off patterns", direction: "↗" },
      { id: 5, x: 55, y: 65, event: "Victim collapses to floor, bleeding heavily", direction: "↓" },
      { id: 6, x: 70, y: 75, event: "Attacker attempts to clean weapon/hands on floor", direction: "↻" },
      { id: 7, x: 85, y: 40, event: "Attacker flees through office door", direction: "→" },
    ],
    deductionQuestions: [
      {
        question: "What type of weapon was used in this attack?",
        options: ["Blunt instrument", "Sharp-edged blade", "Projectile weapon"],
        correct: 1,
        explanation:
          "The linear cast-off patterns and concentrated blood pool indicate a sharp blade weapon, consistent with a knife attack.",
      },
      {
        question: "Was the victim aware of the attacker's approach?",
        options: ["Fully aware and prepared", "Partially aware but surprised", "Completely unaware"],
        correct: 2,
        explanation:
          "The attack pattern from behind while seated, with minimal defensive wounds, suggests the victim was caught off-guard.",
      },
      {
        question: "What does the blood evidence suggest about the attack sequence?",
        options: ["Single fatal blow", "Multiple stab wounds with struggle", "Prolonged torture"],
        correct: 1,
        explanation:
          "Cast-off patterns and impact spatter indicate multiple strikes during a brief but violent struggle before the victim collapsed.",
      },
    ],
  },
}

type GamePhase = "menu" | "pattern" | "timeline" | "deduction" | "complete"

export default function BloodCodeGame() {
  const [phase, setPhase] = useState<GamePhase>("menu")
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const [analyzedPoints, setAnalyzedPoints] = useState<Set<number>>(new Set())
  const [showRadial, setShowRadial] = useState(false)
  const [feedback, setFeedback] = useState<string>("")
  const [timelineStep, setTimelineStep] = useState(0)
  const [deductionAnswers, setDeductionAnswers] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [finalRank, setFinalRank] = useState<string>("")
  const [errorCount, setErrorCount] = useState(0)
  const [pointLabels, setPointLabels] = useState<Map<number, string>>(new Map())
  const [revealedEvents, setRevealedEvents] = useState<Set<number>>(new Set())
  const [eventOrder, setEventOrder] = useState<number[]>([])
  const [timelineCorrect, setTimelineCorrect] = useState<boolean | null>(null)
  const [firstMistakeIndex, setFirstMistakeIndex] = useState<number>(-1)
  const [deductionResults, setDeductionResults] = useState<boolean[]>([])
  const [showDeductionResults, setShowDeductionResults] = useState(false)
  const [timelineAttempts, setTimelineAttempts] = useState(0)
  const [wrongSelections, setWrongSelections] = useState<Map<number, Set<string>>>(new Map())

  // Get current case data
  const currentCase = selectedCase ? CRIME_CASES[selectedCase as keyof typeof CRIME_CASES] : null

  const handleCaseSelect = (caseId: string) => {
    setSelectedCase(caseId)
    // Reset all game state
    setAnalyzedPoints(new Set())
    setErrorCount(0)
    setPointLabels(new Map())
    setRevealedEvents(new Set())
    setEventOrder([])
    setTimelineCorrect(null)
    setFirstMistakeIndex(-1)
    setDeductionAnswers([])
    setDeductionResults([])
    setCurrentQuestion(0)
    setTimelineAttempts(0)
    setWrongSelections(new Map())
    setShowDeductionResults(false)
    setFeedback("")
    setPhase("pattern")
  }

  const handlePointClick = (pointId: number) => {
    setSelectedPoint(pointId)
    setShowRadial(true)
    setFeedback("")
  }

  const handlePatternSelect = (patternKey: string) => {
    if (selectedPoint === null || !currentCase) return

    const point = currentCase.analysisPoints.find((p) => p.id === selectedPoint)
    if (!point) return

    if (point.pattern === patternKey) {
      const pattern = BLOOD_PATTERNS[patternKey as keyof typeof BLOOD_PATTERNS]
      setFeedback(pattern.feedback)
      setAnalyzedPoints((prev) => new Set([...prev, selectedPoint]))
      setPointLabels((prev) => new Map([...prev, [selectedPoint, pattern.name]]))
    } else {
      // Track wrong selection
      setWrongSelections((prev) => {
        const newMap = new Map(prev)
        const pointWrongSelections = newMap.get(selectedPoint) || new Set()
        pointWrongSelections.add(patternKey)
        newMap.set(selectedPoint, pointWrongSelections)
        return newMap
      })

      // Provide specific feedback about why it's wrong
      const selectedPattern = BLOOD_PATTERNS[patternKey as keyof typeof BLOOD_PATTERNS]
      const correctPattern = BLOOD_PATTERNS[point.pattern as keyof typeof BLOOD_PATTERNS]

      setFeedback(
        `Incorrect. "${selectedPattern.name}" is characterized by ${selectedPattern.description.toLowerCase()}, but this pattern shows ${correctPattern.description.toLowerCase()}. Look for: ${correctPattern.implication.toLowerCase()}.`,
      )
      setErrorCount((prev) => prev + 1)
    }

    setShowRadial(false)
    setSelectedPoint(null)
  }

  const handleArrowClick = (arrowId: number) => {
    if (!currentCase) return

    if (revealedEvents.has(arrowId)) {
      // Unclick - remove from revealed events and event order
      setRevealedEvents((prev) => {
        const newSet = new Set(prev)
        newSet.delete(arrowId)
        return newSet
      })
      setEventOrder((prev) => prev.filter((id) => id !== arrowId))
      setTimelineCorrect(null) // Reset validation
      setFirstMistakeIndex(-1)
    } else {
      // Click - add to revealed events and event order
      const newRevealedEvents = new Set([...revealedEvents, arrowId])
      const newEventOrder = [...eventOrder, arrowId]

      setRevealedEvents(newRevealedEvents)
      setEventOrder(newEventOrder)

      // Check if all arrows are now clicked
      if (newRevealedEvents.size === currentCase.timelineArrows.length) {
        // Check the order
        const correctOrder = currentCase.timelineArrows.map((_, index) => index + 1)
        const isCorrect = newEventOrder.every((id, index) => id === correctOrder[index])

        let firstMistakeIndex = -1
        if (!isCorrect) {
          firstMistakeIndex = newEventOrder.findIndex((id, index) => id !== correctOrder[index])
          setTimelineAttempts((prev) => prev + 1)
        }

        setTimelineCorrect(isCorrect)
        setFirstMistakeIndex(firstMistakeIndex)
      }
    }
  }

  const handlePhaseComplete = () => {
    if (!currentCase) return

    if (phase === "pattern" && analyzedPoints.size === currentCase.analysisPoints.length) {
      setPhase("timeline")
    } else if (phase === "deduction" && deductionAnswers.length === currentCase.deductionQuestions.length) {
      calculateFinalRank()
      setPhase("complete")
    }
  }

  const calculateFinalRank = () => {
    if (!currentCase) return

    const correctAnswers = deductionAnswers.filter(
      (answer, index) => answer === currentCase.deductionQuestions[index].correct,
    ).length

    const ranks = ["Trace Architect", "Clinical Analyst", "Blood Whisperer", "Void Walker"]
    setFinalRank(ranks[Math.min(correctAnswers, ranks.length - 1)])
  }

  const RadialInterface = () => {
    const pointWrongSelections = wrongSelections.get(selectedPoint || 0) || new Set()

    return (
      <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
        <div className="relative w-96 h-96">
          {/* Main circle background */}
          <div className="absolute inset-0 rounded-full border-2 border-red-500 bg-slate-800">
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-lg font-bold">Blood Patterns</div>
                <div className="text-sm text-gray-300">Select Pattern Type</div>
              </div>
            </div>
          </div>

          {/* Pattern buttons arranged in circle */}
          {Object.entries(BLOOD_PATTERNS).map(([key, pattern], index) => {
            const angle = index * 45 - 90 // Start from top, 45 degrees apart
            const radian = (angle * Math.PI) / 180
            const radius = 140
            const x = Math.cos(radian) * radius + 192 // Center at 192px
            const y = Math.sin(radian) * radius + 192
            const isWrongSelection = pointWrongSelections.has(key)

            return (
              <button
                key={key}
                className={`absolute text-sm font-medium px-3 py-2 border transform -translate-x-1/2 -translate-y-1/2 transition-colors min-w-[80px] text-center ${
                  isWrongSelection
                    ? "bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed opacity-50"
                    : "bg-red-700 hover:bg-red-600 text-white border-red-500"
                }`}
                style={{ left: x, top: y }}
                onClick={() => !isWrongSelection && handlePatternSelect(key)}
                disabled={isWrongSelection}
              >
                {isWrongSelection ? "✗ " + pattern.name : pattern.name}
              </button>
            )
          })}

          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-red-400 text-xl font-bold w-8 h-8 flex items-center justify-center"
            onClick={() => setShowRadial(false)}
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  // Calculate total mistakes
  const patternMistakes = errorCount
  const timelineMistakes = timelineAttempts
  const deductionMistakes = deductionResults.filter((result) => !result).length
  const totalMistakes = patternMistakes + timelineMistakes + deductionMistakes

  if (phase === "menu") {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-4xl font-bold text-red-500 mb-2">BLOOD CODE</h1>
          <p className="text-gray-400 text-lg">Forensic Analysis Protocol</p>
          <p className="text-gray-500 text-sm mt-2">Analyze the blood patterns to uncover the sequence of events behind the crime.</p>
        </div>

        {/* Case Selection */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Available Crime Scenes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(CRIME_CASES).map((crimeCase) => (
              <Card
                key={crimeCase.id}
                className="bg-gray-900 border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={crimeCase.image || "/placeholder.svg"}
                      alt={crimeCase.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      width={500}
                      height={300}
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          crimeCase.status === "Available" ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {crimeCase.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{crimeCase.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{crimeCase.description}</p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xs text-gray-400">
                        <div>
                          Difficulty: <span className="text-yellow-400">{crimeCase.difficulty}</span>
                        </div>
                        <div>Location: {crimeCase.location}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                      <span>{crimeCase.analysisPoints.length} Evidence Points</span>
                      <span>{crimeCase.timelineArrows.length} Timeline Events</span>
                      <span>{crimeCase.deductionQuestions.length} Questions</span>
                    </div>

                    <Button
                      onClick={() => handleCaseSelect(crimeCase.id)}
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={crimeCase.status !== "Available"}
                    >
                      Begin Investigation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Coming Soon Card */}
            <Card className="bg-gray-900 border-gray-700 border-dashed">
              <CardContent className="p-6 text-center">
                <div className="text-gray-500 mb-4">
                  <div className="text-6xl mb-4">+</div>
                  <h3 className="text-lg font-bold">More Cases Coming Soon</h3>
                  <p className="text-sm mt-2">Additional crime scenes are being prepared for analysis</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!currentCase) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-red-500">BLOOD CODE</h1>
            <p className="text-gray-400 text-sm">Forensic Analysis Protocol</p>
            <p className="text-gray-500 text-xs mt-1">{currentCase.title}</p>
          </div>
          <Button onClick={() => setPhase("menu")} className="bg-gray-700 hover:bg-gray-600 text-sm">
            ← Back to Cases
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Phase: {phase.toUpperCase()} |
          {phase === "pattern" && ` Analyzed: ${analyzedPoints.size}/${currentCase.analysisPoints.length}`}
          {phase === "timeline" && ` Revealed: ${revealedEvents.size}/${currentCase.timelineArrows.length}`}
          {phase === "deduction" && ` Question: ${currentQuestion + 1}/${currentCase.deductionQuestions.length}`}
        </div>
        <div className="absolute top-6 right-32 text-xs text-gray-500">Errors: {errorCount}</div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Crime Scene */}
        <div className="flex-1 relative">
          <div className="relative w-full h-[50vh] lg:h-screen overflow-hidden">
            <Image
              src={currentCase.image || "/placeholder.svg"}
              alt="Crime Scene"
              className="w-full h-full object-cover"
              width={900}
              height={600}
            />

            {/* Analysis Points */}
            {phase === "pattern" &&
              currentCase.analysisPoints.map((point) => (
                <div
                  key={point.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  <button
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      analyzedPoints.has(point.id)
                        ? "bg-green-600 border-green-400"
                        : "bg-red-600 border-red-400 hover:bg-red-500 animate-pulse"
                    }`}
                    onClick={() => handlePointClick(point.id)}
                    disabled={analyzedPoints.has(point.id)}
                  >
                    <span className="text-xs font-bold text-white">{point.id}</span>
                  </button>
                  {pointLabels.has(point.id) && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {pointLabels.get(point.id)}
                    </div>
                  )}
                </div>
              ))}

            {/* Timeline Arrows */}
            {phase === "timeline" &&
              currentCase.timelineArrows.map((arrow) => (
                <div
                  key={arrow.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${arrow.x}%`, top: `${arrow.y}%` }}
                >
                  <button
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center text-lg ${
                      revealedEvents.has(arrow.id)
                        ? "bg-green-600 border-green-400 text-white"
                        : "bg-blue-600 border-blue-400 hover:bg-blue-500 animate-pulse text-white"
                    }`}
                    onClick={() => handleArrowClick(arrow.id)}
                    disabled={timelineCorrect === true}
                  >
                    {arrow.direction}
                  </button>
                </div>
              ))}
{/* Radial Interface */}
            {showRadial && <RadialInterface />}
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="w-full lg:w-96 bg-gray-900 lg:border-l border-gray-800 p-6">
          {phase === "pattern" && (
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-4">Pattern Recognition</h2>
              <p className="text-gray-300 text-sm mb-6">
                Analyze each blood pattern. Click the numbered markers to identify the forensic evidence.
              </p>

              {feedback && (
                <Card className="mb-4 bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <p className={`text-sm ${feedback.startsWith("Incorrect") ? "text-red-400" : "text-green-400"}`}>
                      {feedback}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {currentCase.analysisPoints.map((point) => (
                  <div
                    key={point.id}
                    className={`p-3 rounded border text-sm ${
                      analyzedPoints.has(point.id)
                        ? "bg-green-900 border-green-700 text-green-300"
                        : "bg-gray-800 border-gray-700 text-gray-400"
                    }`}
                  >
                    <span className="font-bold">Point {point.id}:</span> {point.description}
                  </div>
                ))}
              </div>

              {analyzedPoints.size === currentCase.analysisPoints.length && (
                <Button onClick={handlePhaseComplete} className="w-full mt-6 bg-red-600 hover:bg-red-700">
                  Proceed to Timeline Reconstruction
                </Button>
              )}
            </div>
          )}

          {phase === "timeline" && (
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-4">Timeline Reconstruction</h2>
              <p className="text-gray-300 text-sm mb-6">
                Click the motion arrows on the scene to reveal the sequence of events in chronological order. Click
                again to unselect.
              </p>

              {timelineCorrect !== null && (
                <Card className="mb-4 bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    {timelineCorrect ? (
                      <p className="text-sm text-green-400">
                        Correct! You've successfully reconstructed the timeline of events.
                      </p>
                    ) : (
                      <div>
                        <p className="text-sm text-red-400 mb-2">
                          Incorrect sequence. The first mistake is at step {firstMistakeIndex + 1}.
                        </p>
                        <p className="text-xs text-gray-400">
                          {firstMistakeIndex >= 0 &&
                            eventOrder[firstMistakeIndex] &&
                            `Expected: "${currentCase.timelineArrows.find((a) => a.id === firstMistakeIndex + 1)?.event}" but got: "${currentCase.timelineArrows.find((a) => a.id === eventOrder[firstMistakeIndex])?.event}"`}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {eventOrder.map((arrowId, index) => {
                  const arrow = currentCase.timelineArrows.find((a) => a.id === arrowId)
                  const isFromFirstMistakeOnwards =
                    timelineCorrect === false && firstMistakeIndex >= 0 && index >= firstMistakeIndex
                  return (
                    <div
                      key={`${arrowId}-${index}`}
                      className={`p-3 rounded border text-sm ${
                        isFromFirstMistakeOnwards
                          ? "bg-red-900 border-red-700 text-red-300"
                          : "bg-green-900 border-green-700 text-green-300"
                      }`}
                    >
                      <span className="font-bold">{index + 1}.</span> {arrow?.event}
                    </div>
                  )
                })}

                {/* Show remaining unrevealed slots */}
                {Array.from({ length: currentCase.timelineArrows.length - eventOrder.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="p-3 rounded border text-sm bg-gray-800 border-gray-700 text-gray-500"
                  >
                    <span className="font-bold">{eventOrder.length + index + 1}.</span> ???
                  </div>
                ))}
              </div>

              {revealedEvents.size === currentCase.timelineArrows.length && timelineCorrect && (
                <Button onClick={() => setPhase("deduction")} className="w-full mt-6 bg-red-600 hover:bg-red-700">
                  Proceed to Deduction
                </Button>
              )}

              {revealedEvents.size === currentCase.timelineArrows.length && timelineCorrect === false && (
                <Button
                  onClick={() => {
                    // Keep events before the first mistake
                    const eventsToKeep = firstMistakeIndex >= 0 ? eventOrder.slice(0, firstMistakeIndex) : []
                    const arrowsToKeep = new Set(eventsToKeep)

                    setRevealedEvents(arrowsToKeep)
                    setEventOrder(eventsToKeep)
                    setTimelineCorrect(null)
                    setFirstMistakeIndex(-1)
                  }}
                  className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700"
                >
                  Reset Timeline
                </Button>
              )}
            </div>
          )}

          {phase === "deduction" &&
            !showDeductionResults &&
            currentQuestion < currentCase.deductionQuestions.length && (
              <div>
                <h2 className="text-xl font-bold text-red-400 mb-4">Forensic Deduction</h2>
                <p className="text-gray-300 text-sm mb-6">
                  Answer based on your forensic analysis. Every answer must be evidence-based.
                </p>

                {/* Show completed questions */}
                {deductionAnswers.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {deductionAnswers.map((answerIndex, questionIndex) => (
                      <div
                        key={questionIndex}
                        className="p-3 rounded border text-sm bg-green-900 border-green-700 text-green-300"
                      >
                        <span className="font-bold">Q{questionIndex + 1}:</span>{" "}
                        {currentCase.deductionQuestions[questionIndex].question}
                        <br />
                        <span className="text-xs text-gray-300">
                          Answer: {currentCase.deductionQuestions[questionIndex].options[answerIndex]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Card className="mb-6 bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-white mb-4">
                      Q{currentQuestion + 1}: {currentCase.deductionQuestions[currentQuestion].question}
                    </h3>
                    <div className="space-y-2">
                      {currentCase.deductionQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          className="w-full p-3 text-left rounded border border-gray-600 hover:border-red-500 hover:bg-gray-700 transition-colors text-white"
                          onClick={() => {
                            const newAnswers = [...deductionAnswers, index]
                            const isCorrect = index === currentCase.deductionQuestions[currentQuestion].correct
                            const newResults = [...deductionResults, isCorrect]

                            setDeductionAnswers(newAnswers)
                            setDeductionResults(newResults)

                            if (currentQuestion < currentCase.deductionQuestions.length - 1) {
                              setCurrentQuestion((prev) => prev + 1)
                            } else {
                              // All questions answered, show results
                              setShowDeductionResults(true)
                            }
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          {phase === "deduction" && showDeductionResults && (
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-4">Deduction Results</h2>
              <p className="text-gray-300 text-sm mb-6">Review your forensic conclusions and their accuracy.</p>

              <div className="space-y-3 mb-6">
                {deductionAnswers.map((answerIndex, questionIndex) => {
                  const isCorrect = deductionResults[questionIndex]
                  const question = currentCase.deductionQuestions[questionIndex]
                  return (
                    <div
                      key={questionIndex}
                      className={`p-3 rounded border text-sm ${
                        isCorrect
                          ? "bg-green-900 border-green-700 text-green-300"
                          : "bg-red-900 border-red-700 text-red-300"
                      }`}
                    >
                      <div className="font-bold mb-2">
                        Q{questionIndex + 1}: {question.question}
                      </div>
                      <div className="text-xs mb-1">Your answer: {question.options[answerIndex]}</div>
                      {!isCorrect && (
                        <div className="text-xs text-gray-400">
                          Correct answer: {question.options[question.correct]}
                          <br />
                          Explanation: {question.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <Button onClick={handlePhaseComplete} className="w-full bg-red-600 hover:bg-red-700">
                Complete Analysis
              </Button>
            </div>
          )}

          {phase === "complete" && (
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-4">Analysis Complete</h2>

              {/* Phase 1: Pattern Recognition Summary */}
              <Card className="mb-4 bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-bold text-white mb-3">1. Pattern Recognition</h3>
                  <div className="text-sm text-gray-300 mb-2">
                    Identified: {currentCase.analysisPoints.length}/{currentCase.analysisPoints.length} patterns
                  </div>
                  <div className="text-sm text-gray-300 mb-2">Mistakes: {patternMistakes}</div>
                  <div className={`text-sm font-bold ${patternMistakes === 0 ? "text-green-400" : "text-yellow-400"}`}>
                    {patternMistakes === 0 ? "Perfect Analysis" : "Completed with errors"}
                  </div>
                </CardContent>
              </Card>

              {/* Phase 2: Timeline Reconstruction Summary */}
              <Card className="mb-4 bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-bold text-white mb-3">2. Timeline Reconstruction</h3>
                  <div className="text-sm text-gray-300 mb-2">
                    Status: {timelineCorrect ? "Correct sequence" : "Incomplete"}
                  </div>
                  <div className="text-sm text-gray-300 mb-2">Failed attempts: {timelineMistakes}</div>
                  <div className={`text-sm font-bold ${timelineMistakes === 0 ? "text-green-400" : "text-yellow-400"}`}>
                    {timelineMistakes === 0 ? "Perfect Reconstruction" : "Completed with retries"}
                  </div>
                </CardContent>
              </Card>

              {/* Phase 3: Forensic Deduction Summary */}
              <Card className="mb-4 bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-bold text-white mb-3">3. Forensic Deduction</h3>
                  <div className="text-sm text-gray-300 mb-2">
                    Correct answers: {deductionResults.filter((r) => r).length}/{currentCase.deductionQuestions.length}
                  </div>
                  <div className="text-sm text-gray-300 mb-2">Wrong answers: {deductionMistakes}</div>
                  <div
                    className={`text-sm font-bold ${deductionMistakes === 0 ? "text-green-400" : "text-yellow-400"}`}
                  >
                    {deductionMistakes === 0 ? "Perfect Deduction" : "Partial accuracy"}
                  </div>
                </CardContent>
              </Card>

              {/* Total Summary */}
              <Card className="mb-6 bg-gray-800 border-red-700 border-2">
                <CardContent className="p-4">
                  <h3 className="font-bold text-red-400 mb-3">Total Performance</h3>
                  <div className="text-lg text-white mb-2">Total Mistakes: {totalMistakes}</div>
                  <div className="text-2xl font-bold text-green-400 mb-4">{finalRank}</div>
                  <div className="text-sm text-gray-300">
                    Your forensic analysis has been recorded. The evidence speaks for itself.
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => setPhase("menu")} className="w-full bg-red-600 hover:bg-red-700">
                Return to Case Selection
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
