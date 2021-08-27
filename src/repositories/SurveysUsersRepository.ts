import { EntityRepository, Repository } from 'typeorm';
import { SurveyUser } from '../model/SurveyUser';

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<SurveyUser>{}

export { SurveysUsersRepository }