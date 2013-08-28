#!/usr/bin/env python

import json, shutil, os, codecs
from os.path import isfile, join, basename
   
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