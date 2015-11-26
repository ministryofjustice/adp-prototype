###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
page '*.json', layout: false
page '/partials/*', layout: false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (https://middlemanapp.com/advanced/dynamic_pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

data.cases.each do |c|
  proxy "/claims/#{c.id}.html", '/claim.html', locals: {
    claim: c,
    messages: data.messages.select {|m| m.claim_id == c.id },
    defendants: data.defendants.select {|m| m.claim_id == c.id }
  }
end

Slim::Engine.disable_option_validator!
Slim::Engine.set_options pretty: true
Slim::Engine.set_options attr_list_delims: { '(' => ')', '[' => ']' }

###
# Helpers
###

# Methods defined in the helpers block are available in templates
helpers do
  def match_from_collection(local_key, remote_key, collection)
    collection.select {|i| i[remote_key] == local_key }
  end

  def get_full_name(list)
    list.map {|i| "#{i['first_name']} #{i['last_name']}" }
  end

  def get_defendants(case_id)
    defendants = data.defendants.select {|d| d.claim_id == case_id }
    get_full_name(defendants)
  end

  def get_advocates(claim)
    users = data.users.select do |u|
      u.persona_id == claim.advocate_id && u.persona_type == 'Advocate'
    end.map do |u|
      {
        name: "#{u.first_name} #{u.last_name}"
      }
    end
  end

  def local_data(path)
    current_path =  current_resource.path
    result = sitemap.find_resource_by_path(relative_dir(current_path, path).to_s)
    raise "#{path} not found" unless result

    case result.ext
    when '.yaml', '.yml'
      result = YAML.load(result.render)
    when '.json'
      result = JSON.load(result.render)
    end

    result
  end

  def relative_dir(path, *args)
    relative_path = args ? args.join('/') : ''
    Pathname(path).dirname.join(relative_path)
  end
end

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload, ignore: [/source\/images\//]
end

# Load Sass paths and copy images & layouts
require 'find'
`mkdir -p "#{config.source}/#{config.images_dir}" "#{config.source}/#{config.layouts_dir}"`
Find.find('node_modules').grep(/mojular[a-z-]+\/package\.json/).map do |package|
  sassPaths = JSON.parse(IO.read(package))['sassPaths']
  dirname = File.dirname(package)
  sassPaths.map { |path| Sass.load_paths << File.expand_path(path, File.directory?(path) ? '' : dirname) } if sassPaths
  FileUtils.cp_r Find.find(dirname).grep(/images\//), "#{config.source}/#{config.images_dir}"
  FileUtils.cp_r Find.find(dirname).grep(/layouts\/erb\//), "#{config.source}/#{config.layouts_dir}"
end

set :layout, 'adp'

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'


# Simple launcher for local evaluation build
# Double click `build/launch.command` (Mac)
after_build do |builder|
  file = "#{build_dir}/launch.command"
  open(file, 'w') do |f|
    f << "#!/bin/bash\n"
    f << 'cd `dirname $0` && open "http://localhost:8000" && python -m SimpleHTTPServer'
  end
  File.chmod(0555, file)
end

# Build-specific configuration
configure :build do
  set :relative_links, true

  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end

activate :deploy do |deploy|
  deploy.method = :git
end
