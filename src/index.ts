#!/usr/bin/env node
import { Stack, App, StackProps } from '@aws-cdk/cdk';
import { AppContainerRepository } from './stacks/constructs/ecr';
import { ServicePipeline } from './stacks/continuous-delivery';

class ContainerRepo extends Stack {
    constructor(parent: App, name: string, props: StackProps) {
        super(parent, name, props);
        new AppContainerRepository(this, 'RepositoryName', {
            repositoryName: 'test-stack'
        });
    }
}

class DeliveryPipeline extends Stack {
    constructor(parent: App, name: string, props: StackProps) {
        super(parent, name, props);
        new ServicePipeline(this, 'ServicePipelineMk1', {
            artifactName: 'ArtifactName',
            serviceName: this.node.getContext('repoName'), 
            owner: this.node.getContext('owner'),
            secretArn: this.node.getContext('secretArn')
        });
    }
}

// create the app
const app = new App();

new ContainerRepo(app, 'ContainerRepoTest', {
    env: {
        region: 'us-east-1'
    }
});

new DeliveryPipeline(app, 'DeliveryPipeline', {
    env: {
        region: 'us-east-1'
    }
});

app.run();