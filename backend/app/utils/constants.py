# File upload constants
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = ['.pdf', '.docx']

# Skill categories
SKILL_CATEGORIES = {
    'programming': ['python', 'java', 'javascript', 'c++', 'ruby', 'go', 'rust'],
    'web_development': ['react', 'angular', 'vue', 'html', 'css', 'node.js'],
    'data_science': ['python', 'r', 'sql', 'tensorflow', 'pytorch', 'scikit-learn'],
    'cloud_devops': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins'],
}

# Score thresholds
EXCELLENT_SCORE = 80
GOOD_SCORE = 60
AVERAGE_SCORE = 40
POOR_SCORE = 20