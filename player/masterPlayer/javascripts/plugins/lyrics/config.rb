# Set this to the root of your project when deployed:
http_path = "/"
css_dir = ""
sass_dir = ""
images_dir = ""
javascripts_dir = ""

# Set environment
environment = :development

# output_style = :expanded or :nested or :compact or :compressed
output_style = (environment == :production) ? :compressed : :expanded

# Others
relative_assets = true
preferred_syntax = :sass