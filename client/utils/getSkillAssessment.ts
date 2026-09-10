import type { SkillProgress } from '../data/learningProfile'

export type SkillEvidence =
  | 'none'
  | 'early'
  | 'developing'
  | 'reliable'

export type SkillStatus =
  | 'not-tested'
  | 'collecting-data'
  | 'needs-practice'
  | 'developing-well'
  | 'strong'

export type SkillAssessment = {
  accuracy: number | null
  evidence: SkillEvidence
  status: SkillStatus
  label: string
  canInfluenceAdaptiveLearning: boolean
}

export function getSkillAssessment(
  progress: SkillProgress,
): SkillAssessment {
  /*
    --------------------------------
    NO RESULTS
    --------------------------------
  */

  if (progress.total === 0) {
    return {
      accuracy: null,
      evidence: 'none',
      status: 'not-tested',
      label: 'No results yet',
      canInfluenceAdaptiveLearning: false,
    }
  }

  const accuracy = Math.round(
    (progress.correct / progress.total) * 100,
  )

  /*
    --------------------------------
    ONE QUESTION

    Not enough information to make
    an adaptive decision yet.
    --------------------------------
  */

  if (progress.total === 1) {
    return {
      accuracy,
      evidence: 'early',
      status: 'collecting-data',
      label: 'Early result — more answers needed',
      canInfluenceAdaptiveLearning: false,
    }
  }

  /*
    --------------------------------
    TWO OR THREE QUESTIONS

    We can start displaying a trend,
    but should still be careful about
    changing mission difficulty.
    --------------------------------
  */

  if (progress.total <= 3) {
    let status: SkillStatus =
      'developing-well'

    let label =
      'Early progress looks good'

    if (accuracy < 60) {
      status = 'needs-practice'
      label =
        'Early indication — keep practising'
    } else if (accuracy >= 85) {
      status = 'strong'
      label =
        'Early indication — doing very well'
    }

    return {
      accuracy,
      evidence: 'developing',
      status,
      label,
      canInfluenceAdaptiveLearning: false,
    }
  }

  /*
    --------------------------------
    FOUR OR MORE QUESTIONS

    Enough evidence for this skill
    to influence future missions.
    --------------------------------
  */

  if (accuracy >= 85) {
    return {
      accuracy,
      evidence: 'reliable',
      status: 'strong',
      label: 'Strong skill',
      canInfluenceAdaptiveLearning: true,
    }
  }

  if (accuracy >= 70) {
    return {
      accuracy,
      evidence: 'reliable',
      status: 'developing-well',
      label: 'Developing well',
      canInfluenceAdaptiveLearning: true,
    }
  }

  return {
    accuracy,
    evidence: 'reliable',
    status: 'needs-practice',
    label: 'Needs more practice',
    canInfluenceAdaptiveLearning: true,
  }
}