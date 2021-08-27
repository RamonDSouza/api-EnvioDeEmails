import {EntityRepository, Repository } from "typeorm";
import { Survey } from "../model/Survey";


@EntityRepository(Survey)
class SurveysRepository extends Repository<Survey>{

}

export {SurveysRepository}