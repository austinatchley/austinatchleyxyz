# [austinatchley.xyz](https://www.austinatchley.xyz)

## Installation

Clone this repository, cd into it, and run the following command:

```bash
git clone --depth 1 --recursive https://github.com/austinatchley/hugo-theme-hello-friend-ng themes/hello-friend-ng
```

This clones my forked Hugo theme into the necessary themes directory. Install `hugo` through whatever package manager
makes sense on the system, or directly through the official Hugo website. Test the installation and setup by running
`hugo` in the root of this repo

Next, you will need to setup a version of the aws cli locally. Test that it works successfully with `aws s3 ls`

## Running the Site Locally

The `scripts/` directory contains the `run_local.sh` script which can be used to run the site locally. 
If hugo is installed properly, it will run the site by default on port 1313

## Deploying the Site to AWS S3

To deploy the site, use the `hugo_deploy*` scripts in the `scripts` directory. This builds the site locally, 
uploads the artifacts to S3, invalidates the CloudFront CDN cache, and returns the status of each operation.
