interface InodeMailer {
  sendMail(
    email: string,
    subject: string,
    data: { [key: string]: any }
  ): Promise<any>;
}

export default InodeMailer;
