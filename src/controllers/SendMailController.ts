import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailServices from '../services/SendMailServices';
import {resolve} from 'path';
import { AppError } from '../errors/AppError';


class SendMailController{
  async execute(request: Request, response: Response){
    const { email, survey_id} = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({email});

    if(!user){
      throw new AppError("User does not exists");
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if(!survey){
      throw new AppError("Survey does not exists"); 
    }
 
    const npsPath = resolve(__dirname, "..","views","emails","npsMail.hbs")
 
    const surveyUseAlreadyExists = await surveyUserRepository.findOne({
      where:{ user_id: user.id, value: null},
      relations: ["user", "survey"]
    });

    const variables ={
      name: user.name ,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL
    }

    if(surveyUseAlreadyExists){
      variables.id = surveyUseAlreadyExists.id;
      await SendMailServices.execute(email, survey.title,variables, npsPath);
      return response.json(surveyUseAlreadyExists);
    }

    //salvar as Informações na tabela 
    const surveyUser = surveyUserRepository.create({
       user_id: user.id,
      survey_id
    })
    await surveyUserRepository.save(surveyUser); 

    //Enviar e-mail para usuário

    variables.id = surveyUser.id;
    await SendMailServices.execute(email, survey.title,variables, npsPath);

    return response.json(surveyUser);
  }
}

export {SendMailController}