import { Link } from 'react-router'

import { usePlayer } from '../context/PlayerContext'
import {
  type LearningSkill,
  type SkillProgress,
} from '../data/learningProfile'
import { getSkillAssessment } from '../utils/getSkillAssessment'

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

function getDifficultyExplanation(
  completedReadingMissions: number,
  averageAccuracy: number,
  readingLevel: number,
  skillProgress: Record<
    string,
    {
      correct: number
      total: number
    }
  >,
) {
  const accuracyPercent =
    Math.round(averageAccuracy * 100)

  const reliableSkills =
    Object.values(skillProgress).filter(
      (progress) =>
        progress.total >= 4,
    )

  const reliableSkillAccuracies =
    reliableSkills.map(
      (progress) =>
        progress.correct /
        progress.total,
    )

  const hasStrugglingReliableSkill =
    reliableSkillAccuracies.some(
      (accuracy) =>
        accuracy < 0.55,
    )

  if (
    completedReadingMissions < 2
  ) {
    return {
      title:
        'Still collecting early data',
      message:
        'The app keeps the difficulty at Beginner until at least 2 reading missions have been recorded.',
    }
  }

  if (averageAccuracy < 0.6) {
    return {
      title:
        'Beginner support is still useful',
      message:
        `Average accuracy is currently ${accuracyPercent}%, so the app is keeping the reading level gentle while more confidence is built.`,
    }
  }

  if (
    hasStrugglingReliableSkill
  ) {
    return {
      title:
        'A reliable skill needs extra support',
      message:
        'At least one skill with enough recorded answers is below 55% accuracy, so the app is preventing the overall difficulty from increasing too quickly.',
    }
  }

  if (averageAccuracy < 0.75) {
    return {
      title:
        'Ready for Easy difficulty',
      message:
        `Average accuracy is ${accuracyPercent}%, which is strong enough to move beyond Beginner while keeping the challenge gentle.`,
    }
  }

  if (
    completedReadingMissions < 3
  ) {
    return {
      title:
        'More evidence needed for Easy+',
      message:
        `Accuracy is currently ${accuracyPercent}%, but the app waits for at least 3 recorded reading missions before increasing to Easy+.`,
    }
  }

  if (averageAccuracy < 0.9) {
    return {
      title:
        'Ready for Easy+ difficulty',
      message:
        `Zeke has completed at least 3 recorded reading missions with ${accuracyPercent}% average accuracy, so the app can introduce slightly more challenging comprehension, sequencing, and inference work.`,
    }
  }

  const reliableSkillsAtOrAbove70 =
    reliableSkillAccuracies.filter(
      (accuracy) =>
        accuracy >= 0.7,
    ).length

  const allReliableSkillsAtOrAbove70 =
    reliableSkillAccuracies.length > 0 &&
    reliableSkillAccuracies.every(
      (accuracy) =>
        accuracy >= 0.7,
    )

  if (
    completedReadingMissions >= 5 &&
    averageAccuracy >= 0.9 &&
    readingLevel >= 2 &&
    reliableSkillsAtOrAbove70 >= 2 &&
    allReliableSkillsAtOrAbove70
  ) {
    return {
      title:
        'Ready for Medium difficulty',
      message:
        'There is now enough mission history, strong overall accuracy, and reliable skill evidence to safely increase the challenge.',
    }
  }

  return {
    title:
      'Strong performance, but more evidence is needed',
    message:
      'Overall accuracy is high, but the app is waiting for more mission history or reliable skill data before moving to Medium difficulty.',
  }
}

/*
  --------------------------------
  SKILL DISPLAY INFORMATION
  --------------------------------
*/

type SkillDisplayInfo = {
  skill: LearningSkill
  label: string
  icon: string
}

const readingSkills: SkillDisplayInfo[] =
  [
    {
      skill:
        'reading-comprehension',
      label:
        'Reading Comprehension',
      icon: '📖',
    },
    {
      skill: 'vocabulary',
      label: 'Vocabulary',
      icon: '📝',
    },
    {
      skill: 'sequencing',
      label: 'Sequencing',
      icon: '🔢',
    },
    {
      skill: 'inference',
      label: 'Inference',
      icon: '💡',
    },
    {
      skill:
        'sentence-building',
      label:
        'Sentence Building',
      icon: '✏️',
    },
  ]

function DadDashboard() {
  const {
    player,
    learningProfile,
  } = usePlayer()

  const accuracyPercent =
    Math.round(
      learningProfile
        .averageAccuracy * 100,
    )

  const difficultyExplanation =
    getDifficultyExplanation(
      learningProfile
        .completedReadingMissions,
      learningProfile
        .averageAccuracy,
      learningProfile.readingLevel,
      learningProfile.skillProgress,
    )

  /*
    --------------------------------
    SKILL ASSESSMENTS
    --------------------------------
  */

  const skillResults =
    readingSkills.map(
      (skillInfo) => {
        const progress =
          learningProfile
            .skillProgress[
            skillInfo.skill
          ]

        const assessment =
          getSkillAssessment(
            progress,
          )

        return {
          ...skillInfo,
          progress,
          assessment,
        }
      },
    )

  /*
    Only skills with enough
    evidence can influence
    future adaptive missions.
  */

  const reliableSkills =
    skillResults
      .filter(
        (skill) =>
          skill.assessment
            .canInfluenceAdaptiveLearning &&
          skill.assessment
            .accuracy !== null,
      )
      .sort(
        (a, b) =>
          (a.assessment
            .accuracy ?? 0) -
          (b.assessment
            .accuracy ?? 0),
      )

  const prioritySkill =
    reliableSkills.length > 0
      ? reliableSkills[0]
      : null

  /*
    Skills with some results but
    not enough evidence yet.
  */

  const developingSkills =
    skillResults.filter(
      (skill) =>
        skill.progress.total > 0 &&
        !skill.assessment
          .canInfluenceAdaptiveLearning,
    )

  /*
    --------------------------------
    FALLBACK LEARNING FOCUS
    --------------------------------
  */

  const difficultyFocus =
    learningProfile
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

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <header className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-lg md:p-10">
          <p className="text-lg font-bold text-blue-300">
            Parent View
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            Dad Dashboard
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Track reading progress,
            individual learning skills,
            current difficulty, and
            what the adaptive learning
            system recommends next.
          </p>
        </header>

        {/* SUMMARY CARDS */}

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

        {/* PROFILE + LEARNING FOCUS */}

        <section className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* LEARNING PROFILE */}

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

          {/* CURRENT LEARNING FOCUS */}

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
                        prioritySkill.icon
                      }
                    </span>

                    <div>
                      <p className="text-2xl font-black text-orange-950">
                        {
                          prioritySkill.label
                        }
                      </p>

                      <p className="mt-1 font-bold text-orange-800">
                        {
                          prioritySkill
                            .assessment
                            .accuracy
                        }
                        % accuracy
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-slate-700">
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
                  skill data before
                  choosing a specific
                  priority.
                </p>

                {developingSkills.length >
                  0 && (
                  <div className="mt-6 rounded-3xl border-2 border-blue-200 bg-blue-50 p-5">
                    <p className="font-black text-blue-950">
                      🧪 Early skill data
                    </p>

                    <div className="mt-4 space-y-3">
                      {developingSkills.map(
                        (skill) => (
                          <div
                            key={
                              skill.skill
                            }
                            className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3"
                          >
                            <span className="font-bold text-slate-800">
                              {
                                skill.icon
                              }{' '}
                              {
                                skill.label
                              }
                            </span>

                            <span className="text-sm font-bold text-blue-700">
                              {
                                skill
                                  .assessment
                                  .label
                              }
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <p className="mt-6 font-bold text-slate-700">
                  For now, continue
                  practising:
                </p>

                <div className="mt-4 space-y-3">
                  {difficultyFocus.map(
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

        {/* WHY THIS DIFFICULTY */}

        <section className="mt-8 rounded-[2rem] border-4 border-blue-200 bg-blue-50 p-8 shadow-md">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="text-5xl">
              🧠
            </div>

            <div>
              <h2 className="text-3xl font-black text-blue-950">
                Why this difficulty?
              </h2>

              <p className="mt-3 text-xl font-black text-blue-900">
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

        {/* SKILL PROGRESS */}

        <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-5xl">
                🧠
              </p>

              <h2 className="mt-4 text-3xl font-black text-slate-900">
                Skill Progress
              </h2>

              <p className="mt-3 max-w-2xl text-lg text-slate-600">
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
              reading mission
              {learningProfile
                .completedReadingMissions ===
              1
                ? ''
                : 's'}{' '}
              recorded
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {skillResults.map(
              (skill) => (
                <SkillCard
                  key={skill.skill}
                  icon={skill.icon}
                  label={skill.label}
                  progress={
                    skill.progress
                  }
                />
              ),
            )}
          </div>
        </section>

        {/* SUGGESTED NEXT MISSION */}

        <section className="mt-8 rounded-[2rem] border-4 border-green-300 bg-green-50 p-8 shadow-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-5xl">
                🤖
              </p>

              <h2 className="mt-3 text-3xl font-black text-green-950">
                Suggested Next Mission
              </h2>

              <p className="mt-3 text-lg text-green-900">
                The next mission should
                use a{' '}
                <strong>
                  {formatDifficulty(
                    learningProfile
                      .currentDifficulty,
                  )}
                </strong>{' '}
                reading level.
              </p>

              {prioritySkill ? (
                <p className="mt-3 text-lg text-green-900">
                  It should include
                  extra practice in{' '}
                  <strong>
                    {
                      prioritySkill.label
                    }
                  </strong>
                  .
                </p>
              ) : (
                <p className="mt-3 text-lg text-green-900">
                  No individual skill
                  has enough evidence
                  yet to become a
                  priority, so the app
                  should continue
                  collecting balanced
                  reading results.
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-white px-6 py-5 text-center shadow">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Recommended Difficulty
              </p>

              <p className="mt-2 text-2xl font-black text-green-800">
                {formatDifficulty(
                  learningProfile
                    .currentDifficulty,
                )}
              </p>

              {prioritySkill ? (
                <>
                  <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Priority Skill
                  </p>

                  <p className="mt-1 font-black text-orange-700">
                    {
                      prioritySkill.label
                    }
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Skill Status
                  </p>

                  <p className="mt-1 font-black text-blue-700">
                    Collecting Data
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* NAVIGATION */}

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
  SUMMARY CARD
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
  icon: string
  label: string
  progress: SkillProgress
}

function SkillCard({
  icon,
  label,
  progress,
}: SkillCardProps) {
  const assessment =
    getSkillAssessment(progress)

  const hasResults =
    assessment.accuracy !== null

  const accuracy =
    assessment.accuracy ?? 0

  function getStatusIcon() {
    if (
      assessment.status ===
      'not-tested'
    ) {
      return '⚪'
    }

    if (
      assessment.status ===
      'collecting-data'
    ) {
      return '🧪'
    }

    if (
      assessment.status ===
      'strong'
    ) {
      return '🌟'
    }

    if (
      assessment.status ===
      'developing-well'
    ) {
      return '👍'
    }

    return '🎯'
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">
            {icon}
          </span>

          <div>
            <h3 className="text-xl font-black text-slate-900">
              {label}
            </h3>

            {hasResults ? (
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {progress.correct} correct
                out of {progress.total}
              </p>
            ) : (
              <p className="mt-1 text-sm font-semibold text-slate-500">
                No results yet
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          {hasResults ? (
            <p className="text-2xl font-black text-slate-900">
              {accuracy}%
            </p>
          ) : (
            <p className="text-lg font-black text-slate-400">
              —
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-green-600 transition-all duration-700"
          style={{
            width: `${accuracy}%`,
          }}
        />
      </div>

      <div className="mt-4 flex items-start gap-2">
        <span>
          {getStatusIcon()}
        </span>

        <div>
          <p className="text-sm font-bold text-slate-700">
            {assessment.label}
          </p>

          {assessment.canInfluenceAdaptiveLearning && (
            <p className="mt-1 text-xs font-bold text-green-700">
              ✓ Enough evidence for
              adaptive learning
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default DadDashboard