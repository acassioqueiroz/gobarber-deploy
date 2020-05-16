import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '@config/mail';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

interface IMessage {
  to: string;
  body: string;
}

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_DEFAULT_REGION,
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;
    await this.client.sendMail({
      to: {
        name: to.name,
        address: to.email,
      },
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
