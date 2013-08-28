#!/usr/bin/env python

import json, shutil, os, codecs, sys
from os.path import isfile, join, basename
from boto.s3.bucket import Bucket
from boto.s3.key import Key
from boto.s3.connection import S3Connection
   
json_data = open('configuration.json')
data = json.load(json_data)

# Remove build if it exists
try:
    shutil.rmtree('./build')
except:
    pass
    
directories = ['chrome_extension', 'files_to_host']
templatable = ['.html', '.json', '.js']

# Quick and dirty mechanism to copy files to ./build while replacing the appropriate values from configuration.json
print 'Starting to copy files to the build directory...'
for cur_dir in directories:
    new_dir = './build/' + cur_dir
    os.makedirs(new_dir)
    files = [ join(cur_dir,f) for f in os.listdir(cur_dir) if isfile(join(cur_dir,f)) ]
    
    for file in files:
        file_name, file_extension = os.path.splitext(file)
  
        if file_extension in templatable:
            print 'Templating ' + file + ' with configuration.json values'
            with codecs.open(file, 'r', 'utf-8') as cur_file:
                file_data = cur_file.read()
                for cur_key, cur_value in data.iteritems():
                    file_data = file_data.replace("{{" + cur_key + "}}", cur_value)
                
                new_file = codecs.open(join(new_dir,basename(file)), 'w', 'utf-8')
                new_file.write(file_data)
                new_file.close()
        else:
            print 'Copying ' + file + ' without templating'
            shutil.copyfile(file, join(new_dir,basename(file)))
            

deploy_aws = data.get('deploy_aws', "False") == "True"
aws_key = data.get('aws_key', None)
aws_secret = data.get('aws_secret', None)
aws_bucket_name = data.get('aws_bucket_name', None)
aws_version = data.get('extension_version', None)

if deploy_aws and aws_key and aws_secret and aws_bucket_name and aws_version:
    print "Attempting AWS S3 deploy"

    conn = S3Connection(aws_key, aws_secret)
    
    bucket = conn.lookup(aws_bucket_name)
    if bucket is None:
        bucket = conn.create_bucket(aws_bucket_name)
        
    bucket.configure_website(suffix='index.html')
    bucket.set_acl('public-read')
    
    directory_to_deploy = './build/files_to_host/'
    files_to_deploy = [ join(directory_to_deploy,f) for f in os.listdir(directory_to_deploy) if isfile(join(directory_to_deploy,f)) ]
    
    for file in files_to_deploy:
        key_name = aws_version + "/" + basename(file)
        key = Key(bucket=bucket, name=key_name)
        key.set_contents_from_filename(file)
        key.set_acl('public-read')

elif deploy_aws:
    print 'Incorrect configuration for deploying to AWS'