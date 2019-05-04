import { DockerImageAsset } from '@aws-cdk/assets-docker';
import { join } from 'path';
// this could probably be abstracted tpo
const dockerAsset = new DockerImageAsset(this, 'BuildImage', {
    directory: join(__dirname, 'docker-build-image')
});