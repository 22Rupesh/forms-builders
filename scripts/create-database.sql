-- Create database schema for the form builder

-- Forms table
CREATE TABLE IF NOT EXISTS forms (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    header_image VARCHAR(1000),
    questions JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Form responses table
CREATE TABLE IF NOT EXISTS form_responses (
    id VARCHAR(255) PRIMARY KEY,
    form_id VARCHAR(255) NOT NULL,
    answers JSON NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_forms_created_at ON forms(created_at);
CREATE INDEX idx_responses_form_id ON form_responses(form_id);
CREATE INDEX idx_responses_submitted_at ON form_responses(submitted_at);
