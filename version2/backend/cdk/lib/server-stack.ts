import { join } from "path";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RustFunction } from "cargo-lambda-cdk";
import { Cors, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";

export class ServerStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const role = new Role(this, "HandlerRole", {
            assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        });
        role.addManagedPolicy({
            managedPolicyArn:
                "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        });
        role.addManagedPolicy({
            managedPolicyArn:
                "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess",
        });
        const handler = new RustFunction(this, "Handler", {
            role,
            environment: {
                AUTH_DEFAULT_RETURN_TO: "https://matsuri.unronritaro.net/",
                CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME: "delivery.unronritaro.net",
            },
            manifestPath: join(__dirname, "..", ".."),
            binaryName: "matsuri-official-site-server",
            architecture: Architecture.ARM_64,
        });
        const apiDomainName = "api-matsuri.unronritaro.net";
        const api = new LambdaRestApi(
            this,
            "MatsuriOfficialSiteServerRestApi",
            {
                handler,
                domainName: {
                    certificate: Certificate.fromCertificateArn(
                        this,
                        "Certificate",
                        "arn:aws:acm:ap-northeast-1:621702102095:certificate/0b908205-8d8a-4fee-9338-b1a0955e405b",
                    ),
                    domainName: apiDomainName,
                },
            },
        );
        const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
            domainName: "unronritaro.net",
        });
        new ARecord(this, "ApiAliasRecord", {
            zone: hostedZone,
            target: RecordTarget.fromAlias(new ApiGateway(api)),
            recordName: apiDomainName,
        });
    }
}
