import { User } from "../user";
import { UserBirthday, currentYear } from "../value-objects/user-birthdate.vo";

type Cohort = [minAge: number, maxAge: number];
export class DemographicAgeUseCase {
  public static readonly standardCohorts: Cohort[] = [
    [18, 24],
    [25, 34],
    [35, 44],
    [45, 54],
    [55, 64],
    [65, 74],
    [75, 84],
    [85, 94],
    [95, 104],
    [105, 114],
    [115, 125],
  ];

  public static readonly agePhaseCohorts: Cohort[] = [
    [18, 23],
    [24, 29],
    [30, 39],
    [40, 54],
    [55, 74],
    [75, 125],
  ];

  public static readonly pureStadisticCohorts: Cohort[] = [
    [18, 43],
    [44, 68],
    [69, 93],
    [94, 125],
  ]

  public static readonly calculate = (users: User[]) => {
    const populationUniverse = users.length;
    users = users.filter((user) => user.permissions.isAgeAllowed);
    const effectiveSample = users.length;
    const nonResponseRate = populationUniverse - effectiveSample;
    const cohorts = {
      standard: this.splitCohortsByStandard(users),
      agePhase: this.splitCohortsByAgePhase(users),
      pureStatistic: this.splitCohortsByPureStadistic(users),
    };



    return {
      universe: populationUniverse,
      nonResponseRate: nonResponseRate,
      efectiveSample: effectiveSample,
      cohorts: cohorts,
    }
  }

  private static readonly calculateAge = (birthdate: UserBirthday): number => {
    return currentYear.year - birthdate.year;
  }

  private static readonly splitCohorts = (cohorts: Cohort[], users: User[]): Record<string, number> => {
    const usersByCohort: Record<string, number> = {};
    for (let i = 0; i < cohorts.length; i++) {
      const minAge = cohorts[i]![0] as number;
      const maxAge = cohorts[i]![1] as number;
      usersByCohort[`${minAge}-${maxAge}`] =
        users.filter((user) => {
          const userAge = this.calculateAge(user.birthdate);
          if (minAge <= userAge && maxAge > userAge)
            return user;
        }).length
    }
    return usersByCohort;
  }

  private static readonly splitCohortsByStandard = (users: User[]) => {
    return this.splitCohorts(this.standardCohorts, users);
  }
  private static readonly splitCohortsByAgePhase = (users: User[]) => {
    return this.splitCohorts(this.agePhaseCohorts, users);
  }
  private static readonly splitCohortsByPureStadistic = (users: User[]) => {
    return this.splitCohorts(this.pureStadisticCohorts, users);
  }
}