import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
export class AttachmentUtils {

    private s3: AWS.S3
    private bucket: string
    private expire: number
  
    constructor() {
        this.s3 = new XAWS.S3({signatureVersion: 'v4'})
        this.bucket = process.env.ATTACHMENT_S3_BUCKET
        this.expire = parseInt(process.env.SIGNED_URL_EXPIRATION)
    }

    getAttachmentUrl(songId: string) {
        return `https://${this.bucket}.s3.amazonaws.com/${songId}`
    }
  
    async createAttachmentPresignedUrl(id: string): Promise<string> {
        return this.s3.getSignedUrl('putObject', {
            Key: id,
            Bucket: this.bucket,
            Expires: this.expire
        })
    }
}