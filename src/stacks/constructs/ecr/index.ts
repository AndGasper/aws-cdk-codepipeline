#!/usr/bin/env node
import { Repository } from '@aws-cdk/aws-ecr';
import { Construct, CfnOutput } from '@aws-cdk/cdk';

export interface AppRepositoryProps {
    repositoryName: string;
}

export class AppContainerRepository extends Construct {
    constructor(parent: Construct, name: string, props: AppRepositoryProps) {
        super(parent, name);
        const { repositoryName } = props;

        const repository = new Repository(this, repositoryName);
        new CfnOutput(this, 'RepositoryTest', {
            value: repository.repositoryArn
        });
    }
}