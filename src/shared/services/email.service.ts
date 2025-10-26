import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    // Implement email sending logic here
    console.log(`Sending email to: ${to}, Subject: ${subject}`);
    console.log(`Content: ${content}`);
    // Integrate with your email provider (SendGrid, AWS SES, etc.)
  }
}
