import { Link } from 'react-router'

import { usePlayer } from '../context/PlayerContext'
import {
  getSkillsAssessment,
} from '../utils/getSkillsAssessment'
import {
  getDifficultyExplanation,
} from '../utils/getReadingDifficulty'
import { getNextReadingMissionPlan } from '../utils/getNextReadingMissionPlan'
/*
  --------------------------------
  FORMAT DIFFICULTY
  --------------------------------
*/

function formatDifficulty(
  difficulty: string,
) {
  return difficulty
    .split('-')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(' ')
}

/*
  --------------------------------
  SKILL DISPLAY INFORMATION
  --------------------------------
*/

const skillDisplay = {
  'reading-comprehension': {
    name: 'Reading Comprehension',
    icon: '📖',
  },

  vocabulary: {
    name: 'Vocabulary',
    icon: '📝',
  },

  sequencing: {
    name: 'Sequencing',
    icon: '🔢',
  },

  inference: {
    name: 'Inference',
    icon: '💡',
  },

  'sentence-building': {
    name: 'Sentence Building',
    icon: '✏️',
  },
}

/*
  --------------------------------
  DAD DASHBOARD
  --------------------------------
*/

function DadDashboard() {
  const {
    player,
    learningProfile,
    simulateReadingResult,
    resetLearningTestData,
  } = usePlayer()

  /*
    --------------------------------
    GENERAL STATS
    --------------------------------
  */

  const accuracyPercent =
    Math.round(
      learningProfile.averageAccuracy *
        100,
    )

  /*
    --------------------------------
    SKILL ASSESSMENT
    --------------------------------
  */

  const skillsAssessment =
    getSkillsAssessment(
      learningProfile,
    )

  /*
    --------------------------------
    DIFFICULTY EXPLANATION
    --------------------------------
  */

  const difficultyExplanation =
    getDifficultyExplanation(
      learningProfile,
    )
const nextMissionPlan =
  getNextReadingMissionPlan(
    learningProfile,
  )
  /*
    --------------------------------
    FIND PRIORITY SKILL
    --------------------------------

    Only use skills that have enough
    evidence.

    We use 3 answers as the minimum
    amount of evidence.
  */

  const skillsWithEvidence =
    Object.entries(
      learningProfile.skillProgress,
    ).filter(
      ([, progress]) =>
        progress.total >= 3,
    )

  const prioritySkill =
    skillsWithEvidence.length > 0
      ? skillsWithEvidence.reduce(
          (lowest, current) => {
            const lowestAccuracy =
              lowest[1].total > 0
                ? lowest[1].correct /
                  lowest[1].total
                : 1

            const currentAccuracy =
              current[1].total > 0
                ? current[1].correct /
                  current[1].total
                : 1

            return currentAccuracy <
              lowestAccuracy
              ? current
              : lowest
          },
        )
      : null

  /*
    --------------------------------
    CURRENT LEARNING FOCUS
    --------------------------------
  */

  const suggestedFocus =
    prioritySkill
      ? [
          skillDisplay[
            prioritySkill[0] as keyof typeof skillDisplay
          ]?.name ??
            prioritySkill[0],
        ]
      : learningProfile
            .currentDifficulty ===
          'beginner'
        ? [
            'Reading comprehension',
            'Simple vocabulary',
            'Short story recall',
          ]
        : learningProfile
              .currentDifficulty ===
            'easy'
          ? [
              'Reading comprehension',
              'Sequencing',
              'Vocabulary',
            ]
          : learningProfile
                .currentDifficulty ===
              'easy-plus'
            ? [
                'Sequencing',
                'Simple inference',
                'Reading comprehension',
              ]
            : [
                'Inference',
                'Independent reading',
                'Vocabulary in context',
              ]

  /*
    --------------------------------
    READING LEVEL EXPLANATION
    --------------------------------
  */

  function getReadingLevelExplanation() {
    const missionCount =
      learningProfile
        .completedReadingMissions

    const accuracy =
      learningProfile.averageAccuracy

    const level =
      learningProfile.readingLevel

    /*
      Early stage.
    */

    if (missionCount < 3) {
      return {
        title:
          'Still learning about Zeke',

        message:
          'The app is collecting more reading results before changing Zeke’s Reading Level.',
      }
    }

    /*
      Level 1.
    */

    if (level === 1) {
      if (accuracy < 0.65) {
        return {
          title:
            'Building the foundations',

          message:
            'Zeke is staying at Reading Level 1 while the app gives him more practice with core reading skills.',
        }
      }

      return {
        title:
          'Getting close to the next level',

        message:
          'Zeke is showing progress. More consistent strong results can move him toward Reading Level 2.',
      }
    }

    /*
      Level 2.
    */

    if (level === 2) {
      return {
        title:
          'Developing confidence',

        message:
          'Zeke has progressed beyond the starting level. Missions can now gradually use longer stories, sequencing and more vocabulary.',
      }
    }

    /*
      Level 3+
    */

    return {
      title:
        'Reading skills are growing',

      message:
        'Zeke is showing consistent progress, so future missions can gradually introduce more independent reading, inference and vocabulary in context.',
    }
  }

  const readingLevelExplanation =
    getReadingLevelExplanation()

  /*
    --------------------------------
    DEVELOPER TEST MISSIONS
    --------------------------------

    These buttons change ONLY the
    learning profile.

    They do NOT:

    - give stars
    - complete Reading Forest missions
    - change map progress
  */

  function simulateStrongMission() {
    simulateReadingResult([
      {
        skill:
          'reading-comprehension',
        correct: true,
      },
      {
        skill:
          'reading-comprehension',
        correct: true,
      },
      {
        skill: 'vocabulary',
        correct: true,
      },
      {
        skill: 'sequencing',
        correct: true,
      },
    ])
  }

  function simulateMixedMission() {
    simulateReadingResult([
      {
        skill:
          'reading-comprehension',
        correct: true,
      },
      {
        skill:
          'reading-comprehension',
        correct: false,
      },
      {
        skill: 'vocabulary',
        correct: false,
      },
      {
        skill: 'sequencing',
        correct: true,
      },
    ])
  }

  function simulateStrugglingMission() {
    simulateReadingResult([
      {
        skill:
          'reading-comprehension',
        correct: false,
      },
      {
        skill:
          'reading-comprehension',
        correct: false,
      },
      {
        skill: 'vocabulary',
        correct: false,
      },
      {
        skill: 'sequencing',
        correct: true,
      },
    ])
  }

  /*
    --------------------------------
    RESET TEST DATA
    --------------------------------
  */

  function handleResetLearningData() {
    const confirmed =
      window.confirm(
        'Reset adaptive learning test data?\n\nThis will reset reading level, accuracy, recorded reading missions and skill results.\n\nStars and completed Reading Forest missions will NOT be changed.',
      )

    if (!confirmed) {
      return
    }

    resetLearningTestData()
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* -------------------------
            HEADER
        -------------------------- */}

        <header className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-lg md:p-10">
          <p className="text-lg font-bold text-blue-300">
            Parent View
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            Dad Dashboard
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Track reading progress,
            current difficulty, Reading
            Level, individual skills and
            what the adaptive learning
            system recommends next.
          </p>
        </header>

        {/* -------------------------
            TOP STAT CARDS
        -------------------------- */}

        <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon="📚"
            label="Reading Missions"
            value={
              learningProfile
                .completedReadingMissions
            }
          />

          <DashboardCard
            icon="🎯"
            label="Average Accuracy"
            value={`${accuracyPercent}%`}
          />

          <DashboardCard
            icon="🧠"
            label="Current Difficulty"
            value={formatDifficulty(
              learningProfile
                .currentDifficulty,
            )}
          />

          <DashboardCard
            icon="⭐"
            label="Total Stars"
            value={player.stars}
          />
        </section>

        {/* -------------------------
            PROFILE + CURRENT FOCUS
        -------------------------- */}

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-md">
            <p className="text-5xl">
              📈
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-900">
              Learning Profile
            </h2>

            <div className="mt-6 space-y-4 text-lg">
              <ProfileRow
                label="Age"
                value={`${learningProfile.age}`}
              />

              <ProfileRow
                label="Reading Level"
                value={`${learningProfile.readingLevel}`}
              />

              <ProfileRow
                label="Reading Missions Completed"
                value={`${learningProfile.completedReadingMissions}`}
              />

              <ProfileRow
                label="Average Accuracy"
                value={`${accuracyPercent}%`}
              />

              <ProfileRow
                label="Adaptive Difficulty"
                value={formatDifficulty(
                  learningProfile
                    .currentDifficulty,
                )}
              />
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-md">
            <p className="text-5xl">
              🧭
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-900">
              Current Learning Focus
            </h2>

            {prioritySkill ? (
              <>
                <p className="mt-3 text-lg text-slate-600">
                  Based on enough
                  recorded answers, the
                  skill that currently
                  needs the most
                  attention is:
                </p>

                <div className="mt-6 rounded-3xl border-4 border-orange-200 bg-orange-50 p-6">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">
                      {
                        skillDisplay[
                          prioritySkill[0] as keyof typeof skillDisplay
                        ]?.icon
                      }
                    </span>

                    <div>
                      <p className="text-2xl font-black text-orange-950">
                        {
                          skillDisplay[
                            prioritySkill[0] as keyof typeof skillDisplay
                          ]?.name
                        }
                      </p>

                      <p className="mt-1 font-bold text-orange-700">
                        {Math.round(
                          (prioritySkill[1]
                            .correct /
                            prioritySkill[1]
                              .total) *
                            100,
                        )}
                        % accuracy
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-slate-700">
                    There is now enough
                    evidence for this
                    skill to influence
                    future adaptive
                    reading missions.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="mt-3 text-lg text-slate-600">
                  The app is still
                  collecting enough
                  evidence to identify a
                  priority skill.
                </p>

                <div className="mt-6 space-y-3">
                  {suggestedFocus.map(
                    (focus) => (
                      <div
                        key={focus}
                        className="flex items-center gap-3 rounded-2xl bg-blue-50 px-5 py-4"
                      >
                        <span className="text-2xl">
                          ✅
                        </span>

                        <span className="text-lg font-bold text-blue-950">
                          {focus}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* -------------------------
            WHY THIS DIFFICULTY?
        -------------------------- */}

        <section className="mt-8 rounded-[2rem] border-4 border-blue-200 bg-blue-50 p-8 shadow-md">
          <div className="flex gap-5">
            <div className="text-5xl">
              🧠
            </div>

            <div>
              <h2 className="text-3xl font-black text-blue-950">
                Why this difficulty?
              </h2>

              <p className="mt-2 text-xl font-black text-blue-900">
                {formatDifficulty(
                  learningProfile
                    .currentDifficulty,
                )}
              </p>

              <h3 className="mt-5 text-xl font-black text-slate-900">
                {
                  difficultyExplanation.title
                }
              </h3>

              <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-700">
                {
                  difficultyExplanation.message
                }
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------
            WHY THIS READING LEVEL?
        -------------------------- */}

        <section className="mt-8 rounded-[2rem] border-4 border-purple-200 bg-purple-50 p-8 shadow-md">
          <div className="flex gap-5">
            <div className="text-5xl">
              📖
            </div>

            <div>
              <h2 className="text-3xl font-black text-purple-950">
                Why this Reading Level?
              </h2>

              <p className="mt-2 text-xl font-black text-purple-900">
                Level{' '}
                {
                  learningProfile.readingLevel
                }
              </p>

              <h3 className="mt-5 text-xl font-black text-slate-900">
                {
                  readingLevelExplanation.title
                }
              </h3>

              <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-700">
                {
                  readingLevelExplanation.message
                }
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------
            SKILL PROGRESS
        -------------------------- */}

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-5xl">
                🧠
              </p>

              <h2 className="mt-4 text-3xl font-black text-slate-900">
                Skill Progress
              </h2>

              <p className="mt-3 max-w-3xl text-lg text-slate-600">
                Scores are based on
                individual reading
                questions. The app waits
                for enough evidence
                before using a skill to
                influence future
                missions.
              </p>
            </div>

            <p className="font-bold text-slate-500">
              {
                learningProfile
                  .completedReadingMissions
              }{' '}
              {learningProfile
                .completedReadingMissions ===
              1
                ? 'reading mission recorded'
                : 'reading missions recorded'}
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {skillsAssessment.map(
              (assessment) => (
                <SkillCard
                  key={assessment.skill}
                  skill={assessment.skill}
                  correct={
                    assessment.correct
                  }
                  total={
                    assessment.total
                  }
                  accuracy={
                    assessment.accuracy
                  }
                />
              ),
            )}
          </div>
        </section>

       {/* -------------------------
    ADAPTIVE NEXT MISSION PLAN
-------------------------- */}

<section className="mt-8 rounded-[2rem] border-4 border-green-300 bg-green-50 p-8 shadow-md">
  <div>
    <p className="text-5xl">🤖</p>

    <h2 className="mt-3 text-3xl font-black text-green-950">
      Suggested Next Mission
    </h2>

    <p className="mt-3 max-w-3xl text-lg text-green-900">
      This mission plan is created automatically from
      Zeke&apos;s current learning profile.
    </p>

    {/* LEVEL + DIFFICULTY */}

    <div className="mt-6 flex flex-wrap gap-3">
      <span className="rounded-full bg-white px-5 py-3 font-black text-green-900 shadow-sm">
        📖 Level {nextMissionPlan.readingLevel}
      </span>

      <span className="rounded-full bg-white px-5 py-3 font-black text-green-900 shadow-sm">
        🧠 {formatDifficulty(nextMissionPlan.difficulty)}
      </span>
    </div>

    {/* PRIORITY SKILL */}

    <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-black uppercase tracking-wide text-slate-500">
        Priority Skill
      </p>

      {nextMissionPlan.prioritySkill ? (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-3xl">
            {
              skillDisplay[
                nextMissionPlan.prioritySkill as keyof typeof skillDisplay
              ]?.icon
            }
          </span>

          <p className="text-2xl font-black text-slate-900">
            {
              skillDisplay[
                nextMissionPlan.prioritySkill as keyof typeof skillDisplay
              ]?.name
            }
          </p>
        </div>
      ) : (
        <p className="mt-3 text-xl font-black text-slate-900">
          🌱 Collecting balanced skill data
        </p>
      )}
    </div>

    {/* MISSION SETTINGS */}

    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MissionPlanCard
        icon="📚"
        label="Story"
        value={`${nextMissionPlan.storyPages} pages`}
      />

      <MissionPlanCard
        icon="❓"
        label="Questions"
        value={`${nextMissionPlan.questions}`}
      />

      <MissionPlanCard
        icon="✏️"
        label="Sentence Complexity"
        value={formatDifficulty(
          nextMissionPlan.sentenceComplexity,
        )}
      />

      <MissionPlanCard
        icon="📝"
        label="Vocabulary"
        value={formatDifficulty(
          nextMissionPlan.vocabularyLevel,
        )}
      />

      <MissionPlanCard
        icon="🔢"
        label="Sequencing"
        value={
          nextMissionPlan.includeSequencing
            ? 'Included'
            : 'Not yet'
        }
      />

      <MissionPlanCard
        icon="💡"
        label="Inference"
        value={
          nextMissionPlan.includeInference
            ? 'Included'
            : 'Not yet'
        }
      />
    </div>

    {/* WHY */}

    <div className="mt-6 rounded-3xl border-2 border-green-200 bg-white p-6">
      <h3 className="text-xl font-black text-green-950">
        Why this mission?
      </h3>

      <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-700">
        {nextMissionPlan.explanation}
      </p>
    </div>
  </div>
</section>

        {/* -------------------------
            DEVELOPER TESTING
        -------------------------- */}

        <section className="mt-8 rounded-[2rem] border-4 border-dashed border-amber-300 bg-amber-50 p-8 shadow-md">
          <p className="text-5xl">
            🛠️
          </p>

          <h2 className="mt-3 text-3xl font-black text-amber-950">
            Developer Testing
          </h2>

          <p className="mt-3 max-w-3xl text-lg text-amber-900">
            These controls let us test
            the adaptive learning system
            without changing Zeke&apos;s
            stars or completing Reading
            Forest missions.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={
                simulateStrongMission
              }
              className="rounded-2xl bg-green-700 px-6 py-4 font-bold text-white transition hover:scale-105 hover:bg-green-800"
            >
              🌟 Simulate Strong Mission
            </button>

            <button
              type="button"
              onClick={
                simulateMixedMission
              }
              className="rounded-2xl bg-blue-700 px-6 py-4 font-bold text-white transition hover:scale-105 hover:bg-blue-800"
            >
              🧪 Simulate Mixed Mission
            </button>

            <button
              type="button"
              onClick={
                simulateStrugglingMission
              }
              className="rounded-2xl bg-orange-700 px-6 py-4 font-bold text-white transition hover:scale-105 hover:bg-orange-800"
            >
              🎯 Simulate Struggling Mission
            </button>
          </div>

          {/* RESET AREA */}

          <div className="mt-8 border-t border-amber-300 pt-6">
            <h3 className="text-xl font-black text-slate-900">
              Reset Adaptive Test Data
            </h3>

            <p className="mt-2 max-w-3xl text-slate-700">
              Use this after testing to
              return the learning system
              to a clean starting point.
              Stars and completed Reading
              Forest missions are kept.
            </p>

            <button
              type="button"
              onClick={
                handleResetLearningData
              }
              className="mt-5 rounded-2xl bg-red-700 px-6 py-4 font-bold text-white transition hover:scale-105 hover:bg-red-800"
            >
              🔄 Reset Learning Test Data
            </button>
          </div>
        </section>

        {/* -------------------------
            NAVIGATION
        -------------------------- */}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/reading"
            className="rounded-2xl bg-green-700 px-8 py-4 text-lg font-bold text-white transition hover:scale-105 hover:bg-green-800"
          >
            View Reading Forest
          </Link>

          <Link
            to="/"
            className="rounded-2xl bg-slate-700 px-8 py-4 text-lg font-bold text-white transition hover:scale-105 hover:bg-slate-800"
          >
            Back to Academy Home
          </Link>
        </div>
      </div>
    </main>
  )
}

/*
  --------------------------------
  DASHBOARD CARD
  --------------------------------
*/

type DashboardCardProps = {
  icon: string
  label: string
  value: string | number
}

function DashboardCard({
  icon,
  label,
  value,
}: DashboardCardProps) {
  return (
    <article className="rounded-[2rem] bg-white p-6 text-center shadow-md">
      <p className="text-5xl">
        {icon}
      </p>

      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-900">
        {value}
      </p>
    </article>
  )
}

/*
  --------------------------------
  PROFILE ROW
  --------------------------------
*/

type ProfileRowProps = {
  label: string
  value: string
}

function ProfileRow({
  label,
  value,
}: ProfileRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
      <span className="font-semibold text-slate-600">
        {label}
      </span>

      <span className="font-black text-slate-900">
        {value}
      </span>
    </div>
  )
}

/*
  --------------------------------
  SKILL CARD
  --------------------------------
*/

type SkillCardProps = {
  skill: string
  correct: number
  total: number
  accuracy: number | null
}

function SkillCard({
  skill,
  correct,
  total,
  accuracy,
}: SkillCardProps) {
  const display =
    skillDisplay[
      skill as keyof typeof skillDisplay
    ]

  const percentage =
    accuracy === null
      ? null
      : Math.round(
          accuracy * 100,
        )

  function getStatus() {
    if (
      total === 0 ||
      percentage === null
    ) {
      return {
        text: 'No results yet',
        message: '',
      }
    }

    /*
      Less than 3 answers means
      this is still early evidence.
    */

    if (total < 3) {
      if (percentage >= 80) {
        return {
          text: `${correct} correct out of ${total}`,
          message:
            '🌟 Early indication — doing very well',
        }
      }

      return {
        text: `${correct} correct out of ${total}`,
        message:
          '🧪 Early result — more answers needed',
      }
    }

    /*
      Enough evidence exists.
    */

    if (percentage >= 80) {
      return {
        text: `${correct} correct out of ${total}`,
        message:
          '🌟 Strong skill',
      }
    }

    if (percentage >= 60) {
      return {
        text: `${correct} correct out of ${total}`,
        message:
          '👍 Developing well',
      }
    }

    return {
      text: `${correct} correct out of ${total}`,
      message:
        '🎯 Needs more practice',
    }
  }

  const status =
    getStatus()

  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <span className="text-4xl">
            {display?.icon ?? '📚'}
          </span>

          <div>
            <h3 className="text-xl font-black text-slate-900">
              {display?.name ??
                skill}
            </h3>

            <p className="mt-1 text-slate-600">
              {status.text}
            </p>
          </div>
        </div>

        <p className="text-2xl font-black text-slate-900">
          {percentage === null
            ? '—'
            : `${percentage}%`}
        </p>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
        {percentage !== null && (
          <div
            className="h-full rounded-full bg-green-600 transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />
        )}
      </div>

      {status.message && (
        <p className="mt-4 font-bold text-slate-700">
          {status.message}
        </p>
      )}
    </article>
  )
}
/*
  --------------------------------
  MISSION PLAN CARD
  --------------------------------
*/

type MissionPlanCardProps = {
  icon: string
  label: string
  value: string
}

function MissionPlanCard({
  icon,
  label,
  value,
}: MissionPlanCardProps) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl">
          {icon}
        </span>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-xl font-black text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
export default DadDashboard