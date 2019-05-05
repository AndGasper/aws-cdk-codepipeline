#!/usr/bin/env node
import { Construct, CfnOutput } from '@aws-cdk/cdk';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { GitHubSourceAction, GitHubTrigger, CodeBuildAction } from '@aws-cdk/aws-codepipeline-actions';
import {  Pipeline, Artifact } from '@aws-cdk/aws-codepipeline';
import { PipelineProject } from '@aws-cdk/aws-codebuild';



export interface ServicePipelineProps {
    artifactName: string;
    serviceName: string;
    owner: string;
    secretArn: string;
    
}

export class ServicePipeline extends Construct {
    constructor(parent: Construct, name: string, props: ServicePipelineProps) {
        super(parent, name);

        const project = new PipelineProject(this, 'ProjectName');
        // get the repo auth
        // @ts-ignore: no-implicit-any
        const versionControlAccessToken = Secret.import(this, 'VersionControlToken', {
            secretArn: props.secretArn
        });
        const sourceOutput = new Artifact();
        // register the github actions
        const sourceAction = new GitHubSourceAction({
            actionName: 'SourceControl',
            owner: props.owner,
            repo: props.serviceName,
            oauthToken: versionControlAccessToken.secretValue,
            trigger: GitHubTrigger["WebHook"],
            output: sourceOutput
        });

        

        // "build" the code
        const buildAction = new CodeBuildAction({
            actionName: 'Build',
            project: project,
            input: sourceOutput,
            output: new Artifact()
        });

        // create the pipeline
        const pipeline = new Pipeline(this, 'ServicePipeline', {
            pipelineName: props.serviceName,
            stages: [
                {
                    name: 'Source',
                    actions: [sourceAction]
                },
                {
                    name: 'Build',
                    actions: [buildAction],
                }
            ]
        });

        new CfnOutput(this, 'ServicePipelineInfo', {
            value: pipeline.pipelineArn
        });
    }
}