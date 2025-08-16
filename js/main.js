class ResumeBuilder {
    constructor() {
        this.data = {
            personal: {},
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            languages: [],
            awards: [],
            references: [],
            customSection: {
                title: '',
                items: []
            }
        };
        this.currentTemplate = 'modern';
        this.currentTheme = 'dark-blue';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromStorage();
        this.updateProgress();
        this.renderPreview();
        this.setupAutoSave();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Template selection
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectTemplate(e.currentTarget.dataset.template);
            });
        });

        // Theme selection
        document.querySelectorAll('.theme-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectTheme(e.currentTarget.dataset.theme);
            });
        });

        // Personal info inputs
        this.setupPersonalInfoListeners();

        // Dynamic sections
        this.setupDynamicSections();

        // Skills
        this.setupSkillsSection();

        // Action buttons
        document.getElementById('clearFormBtn').addEventListener('click', () => {
            this.clearForm();
        });

        document.getElementById('downloadPdfBtn').addEventListener('click', () => {
            this.downloadPDF();
        });

        document.getElementById('exportJsonBtn').addEventListener('click', () => {
            this.exportJSON();
        });
    }

    setupPersonalInfoListeners() {
        const personalFields = ['fullName', 'email', 'phone', 'location', 'website', 'linkedin', 'github', 'summary'];
        
        personalFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.data.personal[field] = e.target.value;
                    this.updateProgress();
                    this.renderPreview();
                });
            }
        });
    }

    setupDynamicSections() {
        // Experience
        document.getElementById('addExperienceBtn').addEventListener('click', () => {
            this.addExperience();
        });

        // Education
        document.getElementById('addEducationBtn').addEventListener('click', () => {
            this.addEducation();
        });

        // Projects
        document.getElementById('addProjectBtn').addEventListener('click', () => {
            this.addProject();
        });

        // Certifications
        document.getElementById('addCertificationBtn').addEventListener('click', () => {
            this.addCertification();
        });

        // Languages
        document.getElementById('addLanguageBtn').addEventListener('click', () => {
            this.addLanguage();
        });

        // Awards
        document.getElementById('addAwardBtn').addEventListener('click', () => {
            this.addAward();
        });

        // References
        document.getElementById('addReferenceBtn').addEventListener('click', () => {
            this.addReference();
        });

        // Custom section
        document.getElementById('addCustomItemBtn').addEventListener('click', () => {
            this.addCustomItem();
        });

        document.getElementById('customSectionTitle').addEventListener('input', (e) => {
            this.data.customSection.title = e.target.value;
            this.renderPreview();
        });
    }

    setupSkillsSection() {
        const skillInput = document.getElementById('skillInput');
        skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const skill = e.target.value.trim();
                if (skill && !this.data.skills.includes(skill)) {
                    this.data.skills.push(skill);
                    this.renderSkillTags();
                    this.updateProgress();
                    this.renderPreview();
                    e.target.value = '';
                }
            }
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    selectTemplate(template) {
        this.currentTemplate = template;
        
        // Update template selection UI
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-template="${template}"]`).classList.add('active');
        
        this.renderPreview();
    }

    selectTheme(theme) {
        this.currentTheme = theme;
        
        // Update theme selection UI
        document.querySelectorAll('.theme-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        
        this.renderPreview();
    }

    addExperience() {
        const experience = {
            id: Date.now(),
            jobTitle: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        };

        this.data.experience.push(experience);
        this.renderExperienceList();
        this.updateProgress();
        this.renderPreview();
    }

    renderExperienceList() {
        const container = document.getElementById('experienceList');
        container.innerHTML = '';

        this.data.experience.forEach(exp => {
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <button class="remove-item" onclick="resumeBuilder.removeExperience(${exp.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" value="${exp.jobTitle}" onchange="resumeBuilder.updateExperience(${exp.id}, 'jobTitle', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" value="${exp.company}" onchange="resumeBuilder.updateExperience(${exp.id}, 'company', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" value="${exp.location}" onchange="resumeBuilder.updateExperience(${exp.id}, 'location', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="month" value="${exp.startDate}" onchange="resumeBuilder.updateExperience(${exp.id}, 'startDate', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="month" value="${exp.endDate}" ${exp.current ? 'disabled' : ''} onchange="resumeBuilder.updateExperience(${exp.id}, 'endDate', this.value)">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" ${exp.current ? 'checked' : ''} onchange="resumeBuilder.updateExperience(${exp.id}, 'current', this.checked)"> Currently working here
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Job Description</label>
                    <textarea rows="3" onchange="resumeBuilder.updateExperience(${exp.id}, 'description', this.value)">${exp.description}</textarea>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateExperience(id, field, value) {
        const experience = this.data.experience.find(exp => exp.id === id);
        if (experience) {
            experience[field] = value;
            if (field === 'current' && value) {
                experience.endDate = '';
            }
            this.renderExperienceList();
            this.updateProgress();
            this.renderPreview();
        }
    }

    removeExperience(id) {
        this.data.experience = this.data.experience.filter(exp => exp.id !== id);
        this.renderExperienceList();
        this.updateProgress();
        this.renderPreview();
    }

    addEducation() {
        const education = {
            id: Date.now(),
            degree: '',
            institution: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: '',
            description: ''
        };

        this.data.education.push(education);
        this.renderEducationList();
        this.updateProgress();
        this.renderPreview();
    }

    renderEducationList() {
        const container = document.getElementById('educationList');
        container.innerHTML = '';

        this.data.education.forEach(edu => {
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <button class="remove-item" onclick="resumeBuilder.removeEducation(${edu.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Degree</label>
                        <input type="text" value="${edu.degree}" onchange="resumeBuilder.updateEducation(${edu.id}, 'degree', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Institution</label>
                        <input type="text" value="${edu.institution}" onchange="resumeBuilder.updateEducation(${edu.id}, 'institution', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" value="${edu.location}" onchange="resumeBuilder.updateEducation(${edu.id}, 'location', this.value)">
                    </div>
                    <div class="form-group">
                        <label>GPA (Optional)</label>
                        <input type="text" value="${edu.gpa}" onchange="resumeBuilder.updateEducation(${edu.id}, 'gpa', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="month" value="${edu.startDate}" onchange="resumeBuilder.updateEducation(${edu.id}, 'startDate', this.value)">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="month" value="${edu.endDate}" onchange="resumeBuilder.updateEducation(${edu.id}, 'endDate', this.value)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description (Optional)</label>
                    <textarea rows="2" onchange="resumeBuilder.updateEducation(${edu.id}, 'description', this.value)">${edu.description}</textarea>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateEducation(id, field, value) {
        const education = this.data.education.find(edu => edu.id === id);
        if (education) {
            education[field] = value;
            this.updateProgress();
            this.renderPreview();
        }
    }

    removeEducation(id) {
        this.data.education = this.data.education.filter(edu => edu.id !== id);
        this.renderEducationList();
        this.updateProgress();
        this.renderPreview();
    }

    addProject() {
        const project = {
            id: Date.now(),
            name: '',
            description: '',
            technologies: '',
            liveUrl: '',
            githubUrl: '',
            startDate: '',
            endDate: ''
        };

        this.data.projects.push(project);
        this.renderProjectList();
        this.updateProgress();
        this.renderPreview();
    }

    renderProjectList() {
        const container = document.getElementById('projectList');
        container.innerHTML = '';

        this.data.projects.forEach(project => {
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <button class="remove-item" onclick="resumeBuilder.removeProject(${project.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Project Name</label>
                        <input type="text" value="${project.name}" onchange="resumeBuilder.updateProject(${project.id}, 'name', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Technologies Used</label>
                        <input type="text" value="${project.technologies}" placeholder="React, Node.js, MongoDB" onchange="resumeBuilder.updateProject(${project.id}, 'technologies', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Live URL</label>
                        <input type="url" value="${project.liveUrl}" onchange="resumeBuilder.updateProject(${project.id}, 'liveUrl', this.value)">
                    </div>
                    <div class="form-group">
                        <label>GitHub URL</label>
                        <input type="url" value="${project.githubUrl}" onchange="resumeBuilder.updateProject(${project.id}, 'githubUrl', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="month" value="${project.startDate}" onchange="resumeBuilder.updateProject(${project.id}, 'startDate', this.value)">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="month" value="${project.endDate}" onchange="resumeBuilder.updateProject(${project.id}, 'endDate', this.value)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Project Description</label>
                    <textarea rows="3" onchange="resumeBuilder.updateProject(${project.id}, 'description', this.value)">${project.description}</textarea>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateProject(id, field, value) {
        const project = this.data.projects.find(proj => proj.id === id);
        if (project) {
            project[field] = value;
            this.updateProgress();
            this.renderPreview();
        }
    }

    removeProject(id) {
        this.data.projects = this.data.projects.filter(proj => proj.id !== id);
        this.renderProjectList();
        this.updateProgress();
        this.renderPreview();
    }

    addCertification() {
        const certification = {
            id: Date.now(),
            name: '',
            issuer: '',
            issueDate: '',
            expiryDate: '',
            credentialId: '',
            url: ''
        };

        this.data.certifications.push(certification);
        this.renderCertificationList();
        this.updateProgress();
        this.renderPreview();
    }

    renderCertificationList() {
        const container = document.getElementById('certificationList');
        container.innerHTML = '';

        this.data.certifications.forEach(cert => {
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <button class="remove-item" onclick="resumeBuilder.removeCertification(${cert.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Certification Name</label>
                        <input type="text" value="${cert.name}" onchange="resumeBuilder.updateCertification(${cert.id}, 'name', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Issuing Organization</label>
                        <input type="text" value="${cert.issuer}" onchange="resumeBuilder.updateCertification(${cert.id}, 'issuer', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Issue Date</label>
                        <input type="month" value="${cert.issueDate}" onchange="resumeBuilder.updateCertification(${cert.id}, 'issueDate', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Expiry Date (Optional)</label>
                        <input type="month" value="${cert.expiryDate}" onchange="resumeBuilder.updateCertification(${cert.id}, 'expiryDate', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Credential ID</label>
                        <input type="text" value="${cert.credentialId}" onchange="resumeBuilder.updateCertification(${cert.id}, 'credentialId', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Credential URL</label>
                        <input type="url" value="${cert.url}" onchange="resumeBuilder.updateCertification(${cert.id}, 'url', this.value)">
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateCertification(id, field, value) {
        const certification = this.data.certifications.find(cert => cert.id === id);
        if (certification) {
            certification[field] = value;
            this.updateProgress();
            this.renderPreview();
        }
    }

    removeCertification(id) {
        this.data.certifications = this.data.certifications.filter(cert => cert.id !== id);
        this.renderCertificationList();
        this.updateProgress();
        this.renderPreview();
    }

    addLanguage() {
        const language = {
            id: Date.now(),
            name: '',
            proficiency: 'beginner'
        };

        this.data.languages.push(language);
        this.renderLanguageList();
        this.updateProgress();
        this.renderPreview();
    }

    renderLanguageList() {
        const container = document.getElementById('languageList');
        container.innerHTML = '';

        this.data.languages.forEach(lang => {
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <button class="remove-item" onclick="resumeBuilder.removeLanguage(${lang.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Language</label>
                        <input type="text" value="${lang.name}" onchange="resumeBuilder.updateLanguage(${lang.id}, 'name', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Proficiency Level</label>
                        <select onchange="resumeBuilder.updateLanguage(${lang.id}, 'proficiency', this.value)">
                            <option value="beginner" ${lang.proficiency === 'beginner' ? 'selected' : ''}>Beginner</option>
                            <option value="intermediate" ${lang.proficiency === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                            <option value="advanced" ${lang.proficiency === 'advanced' ? 'selected' : ''}>Advanced</option>
                            <option value="fluent" ${lang.proficiency === 'fluent' ? 'selected' : ''}>Fluent</option>
                            <option value="native" ${lang.proficiency === 'native' ? 'selected' : ''}>Native</option>
                        </select>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateLanguage(id, field, value) {
        const language = this.data.languages.find(lang => lang.id === id);
        if (language) {
            language[field] = value;
            this.updateProgress();
            this.renderPreview();
        }
    }

    removeLanguage(id) {
        this.data.languages = this.data.languages.filter(lang => lang.id !== id);
        this.renderLanguageList();
        this.updateProgress();
        this.renderPreview();
    }

    addAward() {
        const award = {
            id: Date.now(),
            title: '',
            issuer: '',
            date: '',
            description: ''
        };

        this.data.awards.push(award);
        this.renderAwardList();
        this.updateProgress();
        this.renderPreview();
    }

    renderAwardList() {
        const container = document.getElementById('awardList');
        container.innerHTML = '';

        this.data.awards.forEach(award => {
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <button class="remove-item" onclick="resumeBuilder.removeAward(${award.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Award Title</label>
                        <input type="text" value="${award.title}" onchange="resumeBuilder.updateAward(${award.id}, 'title', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Issuing Organization</label>
                        <input type="text" value="${award.issuer}" onchange="resumeBuilder.updateAward(${award.id}, 'issuer', this.value)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Date Received</label>
                    <input type="month" value="${award.date}" onchange="resumeBuilder.updateAward(${award.id}, 'date', this.value)">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea rows="2" onchange="resumeBuilder.updateAward(${award.id}, 'description', this.value)">${award.description}</textarea>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateAward(id, field, value) {
        const award = this.data.awards.find(award => award.id === id);
        if (award) {
            award[field] = value;
            this.updateProgress();
            this.renderPreview();
        }
    }

    removeAward(id) {
        this.data.awards = this.data.awards.filter(award => award.id !== id);
        this.renderAwardList();
        this.updateProgress();
        this.renderPreview();
    }

    addReference() {
        const reference = {
            id: Date.now(),
            name: '',
            title: '',
            company: '',
            email: '',
            phone: '',
            relationship: ''
        };

        this.data.references.push(reference);
        this.renderReferenceList();
        this.updateProgress();
        this.renderPreview();
    }

    renderReferenceList() {
        const container = document.getElementById('referenceList');
        container.innerHTML = '';

        this.data.references.forEach(ref => {
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <button class="remove-item" onclick="resumeBuilder.removeReference(${ref.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" value="${ref.name}" onchange="resumeBuilder.updateReference(${ref.id}, 'name', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" value="${ref.title}" onchange="resumeBuilder.updateReference(${ref.id}, 'title', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" value="${ref.company}" onchange="resumeBuilder.updateReference(${ref.id}, 'company', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Relationship</label>
                        <input type="text" value="${ref.relationship}" placeholder="Former Manager, Colleague" onchange="resumeBuilder.updateReference(${ref.id}, 'relationship', this.value)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="${ref.email}" onchange="resumeBuilder.updateReference(${ref.id}, 'email', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" value="${ref.phone}" onchange="resumeBuilder.updateReference(${ref.id}, 'phone', this.value)">
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateReference(id, field, value) {
        const reference = this.data.references.find(ref => ref.id === id);
        if (reference) {
            reference[field] = value;
            this.updateProgress();
            this.renderPreview();
        }
    }

    removeReference(id) {
        this.data.references = this.data.references.filter(ref => ref.id !== id);
        this.renderReferenceList();
        this.updateProgress();
        this.renderPreview();
    }

    addCustomItem() {
        const item = {
            id: Date.now(),
            title: '',
            subtitle: '',
            date: '',
            description: ''
        };

        this.data.customSection.items.push(item);
        this.renderCustomSectionList();
        this.updateProgress();
        this.renderPreview();
    }

    renderCustomSectionList() {
        const container = document.getElementById('customSectionList');
        container.innerHTML = '';

        this.data.customSection.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'dynamic-item';
            div.innerHTML = `
                <button class="remove-item" onclick="resumeBuilder.removeCustomItem(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="form-row">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" value="${item.title}" onchange="resumeBuilder.updateCustomItem(${item.id}, 'title', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Subtitle</label>
                        <input type="text" value="${item.subtitle}" onchange="resumeBuilder.updateCustomItem(${item.id}, 'subtitle', this.value)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="month" value="${item.date}" onchange="resumeBuilder.updateCustomItem(${item.id}, 'date', this.value)">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea rows="2" onchange="resumeBuilder.updateCustomItem(${item.id}, 'description', this.value)">${item.description}</textarea>
                </div>
            `;
            container.appendChild(div);
        });
    }

    updateCustomItem(id, field, value) {
        const item = this.data.customSection.items.find(item => item.id === id);
        if (item) {
            item[field] = value;
            this.updateProgress();
            this.renderPreview();
        }
    }

    removeCustomItem(id) {
        this.data.customSection.items = this.data.customSection.items.filter(item => item.id !== id);
        this.renderCustomSectionList();
        this.updateProgress();
        this.renderPreview();
    }

    renderSkillTags() {
        const container = document.getElementById('skillTags');
        container.innerHTML = '';

        this.data.skills.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                ${skill}
                <button class="remove-skill" onclick="resumeBuilder.removeSkill('${skill}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(tag);
        });
    }

    removeSkill(skill) {
        this.data.skills = this.data.skills.filter(s => s !== skill);
        this.renderSkillTags();
        this.updateProgress();
        this.renderPreview();
    }

    updateProgress() {
        const totalFields = this.calculateTotalFields();
        const filledFields = this.calculateFilledFields();
        const progress = Math.round((filledFields / totalFields) * 100);
        
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}% Complete`;
    }

    calculateTotalFields() {
        return 8 + // Personal info fields
               (this.data.experience.length * 6) +
               (this.data.education.length * 6) +
               1 + // Skills (counted as 1 if any exist)
               (this.data.projects.length * 7) +
               (this.data.certifications.length * 6) +
               (this.data.languages.length * 2) +
               (this.data.awards.length * 4) +
               (this.data.references.length * 6) +
               (this.data.customSection.items.length * 4) +
               (this.data.customSection.title ? 1 : 0);
    }

    calculateFilledFields() {
        let filled = 0;
        
        // Personal info
        Object.values(this.data.personal).forEach(value => {
            if (value && value.toString().trim()) filled++;
        });
        
        // Experience
        this.data.experience.forEach(exp => {
            Object.values(exp).forEach(value => {
                if (value && value.toString().trim()) filled++;
            });
        });
        
        // Education
        this.data.education.forEach(edu => {
            Object.values(edu).forEach(value => {
                if (value && value.toString().trim()) filled++;
            });
        });
        
        // Skills
        if (this.data.skills.length > 0) filled++;
        
        // Projects
        this.data.projects.forEach(proj => {
            Object.values(proj).forEach(value => {
                if (value && value.toString().trim()) filled++;
            });
        });
        
        // Certifications
        this.data.certifications.forEach(cert => {
            Object.values(cert).forEach(value => {
                if (value && value.toString().trim()) filled++;
            });
        });
        
        // Languages
        this.data.languages.forEach(lang => {
            Object.values(lang).forEach(value => {
                if (value && value.toString().trim()) filled++;
            });
        });
        
        // Awards
        this.data.awards.forEach(award => {
            Object.values(award).forEach(value => {
                if (value && value.toString().trim()) filled++;
            });
        });
        
        // References
        this.data.references.forEach(ref => {
            Object.values(ref).forEach(value => {
                if (value && value.toString().trim()) filled++;
            });
        });
        
        // Custom section
        if (this.data.customSection.title && this.data.customSection.title.trim()) filled++;
        this.data.customSection.items.forEach(item => {
            Object.values(item).forEach(value => {
                if (value && value.toString().trim()) filled++;
            });
        });
        
        return filled;
    }

    renderPreview() {
        const preview = document.getElementById('resumePreview');
        const templateClass = `resume-${this.currentTemplate}`;
        
        // Check if resume has any meaningful content
        const hasContent = this.hasResumeContent();
        
        if (!hasContent) {
            preview.className = `resume-preview empty ${templateClass}`;
            preview.innerHTML = this.generateEmptyState();
        } else {
            preview.className = `resume-preview ${templateClass}`;
            preview.innerHTML = this.generateResumeHTML();
        }
    }

    hasResumeContent() {
        const { personal } = this.data;
        
        // Check if we have at least a name or some basic content
        return (personal.fullName && personal.fullName.trim()) ||
               (personal.email && personal.email.trim()) ||
               (personal.summary && personal.summary.trim()) ||
               this.data.experience.length > 0 ||
               this.data.education.length > 0 ||
               this.data.skills.length > 0 ||
               this.data.projects.length > 0 ||
               this.data.certifications.length > 0 ||
               this.data.languages.length > 0 ||
               this.data.awards.length > 0 ||
               this.data.references.length > 0 ||
               (this.data.customSection.title && this.data.customSection.title.trim()) ||
               this.data.customSection.items.length > 0;
    }

    generateEmptyState() {
        return `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>Start Building Your Resume</h3>
                <p>Fill out the form on the left to see your professional resume take shape in real-time.</p>
            </div>
        `;
    }

    generateResumeHTML() {
        const { personal } = this.data;
        
        let html = `
            <div class="resume-header">
                <h1>${personal.fullName || 'Your Name'}</h1>
                <div class="contact-info">
        `;
        
        if (personal.email) html += `<span><i class="fas fa-envelope"></i> ${personal.email}</span>`;
        if (personal.phone) html += `<span><i class="fas fa-phone"></i> ${personal.phone}</span>`;
        if (personal.location) html += `<span><i class="fas fa-map-marker-alt"></i> ${personal.location}</span>`;
        if (personal.website) html += `<span><i class="fas fa-globe"></i> ${personal.website}</span>`;
        if (personal.linkedin) html += `<span><i class="fab fa-linkedin"></i> LinkedIn</span>`;
        if (personal.github) html += `<span><i class="fab fa-github"></i> GitHub</span>`;
        
        html += `
                </div>
            </div>
            <div class="resume-content">
        `;
        
        // Summary
        if (personal.summary) {
            html += `
                <div class="resume-section">
                    <h2>Professional Summary</h2>
                    <p>${personal.summary}</p>
                </div>
            `;
        }
        
        // Experience
        if (this.data.experience.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>Work Experience</h2>
            `;
            
            this.data.experience.forEach(exp => {
                if (exp.jobTitle || exp.company) {
                    html += `
                        <div class="resume-item">
                            <h3>${exp.jobTitle}</h3>
                            <div class="item-meta">
                                ${exp.company}${exp.location ? `, ${exp.location}` : ''}
                                ${exp.startDate ? ` • ${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate)}` : ''}
                            </div>
                            ${exp.description ? `<div class="item-description">${this.formatDescription(exp.description)}</div>` : ''}
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Education
        if (this.data.education.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>Education</h2>
            `;
            
            this.data.education.forEach(edu => {
                if (edu.degree || edu.institution) {
                    html += `
                        <div class="resume-item">
                            <h3>${edu.degree}</h3>
                            <div class="item-meta">
                                ${edu.institution}${edu.location ? `, ${edu.location}` : ''}
                                ${edu.startDate ? ` • ${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}` : ''}
                                ${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                            </div>
                            ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Skills
        if (this.data.skills.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>Skills</h2>
                    <div class="resume-skills">
            `;
            
            this.data.skills.forEach(skill => {
                html += `<span class="resume-skill">${skill}</span>`;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // Projects
        if (this.data.projects.length > 0) {
            html += `
                <div class="resume-section resume-projects">
                    <h2>Projects</h2>
            `;
            
            this.data.projects.forEach(project => {
                if (project.name) {
                    html += `
                        <div class="resume-item">
                            <h3>${project.name}</h3>
                            <div class="item-meta">
                                ${project.technologies ? `${project.technologies}` : ''}
                                ${project.startDate ? ` • ${this.formatDate(project.startDate)} - ${this.formatDate(project.endDate)}` : ''}
                            </div>
                            ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
                            ${project.liveUrl || project.githubUrl ? `
                                <div class="project-links">
                                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                                    ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Certifications
        if (this.data.certifications.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>Certifications</h2>
            `;
            
            this.data.certifications.forEach(cert => {
                if (cert.name) {
                    html += `
                        <div class="resume-item">
                            <h3>${cert.name}</h3>
                            <div class="item-meta">
                                ${cert.issuer}${cert.issueDate ? ` • ${this.formatDate(cert.issueDate)}` : ''}${cert.expiryDate ? ` - ${this.formatDate(cert.expiryDate)}` : ''}
                                ${cert.credentialId ? ` • ID: ${cert.credentialId}` : ''}
                            </div>
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Languages
        if (this.data.languages.length > 0) {
            html += `
                <div class="resume-section resume-languages">
                    <h2>Languages</h2>
            `;
            
            this.data.languages.forEach(lang => {
                if (lang.name) {
                    html += `
                        <div class="language-item">
                            <span class="language-name">${lang.name}</span>
                            <span class="language-level">${lang.proficiency.charAt(0).toUpperCase() + lang.proficiency.slice(1)}</span>
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Awards
        if (this.data.awards.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>Awards & Achievements</h2>
            `;
            
            this.data.awards.forEach(award => {
                if (award.title) {
                    html += `
                        <div class="resume-item">
                            <h3>${award.title}</h3>
                            <div class="item-meta">
                                ${award.issuer}${award.date ? ` • ${this.formatDate(award.date)}` : ''}
                            </div>
                            ${award.description ? `<div class="item-description">${award.description}</div>` : ''}
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // References
        if (this.data.references.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>References</h2>
            `;
            
            this.data.references.forEach(ref => {
                if (ref.name) {
                    html += `
                        <div class="resume-item">
                            <h3>${ref.name}</h3>
                            <div class="item-meta">
                                ${ref.title}${ref.company ? `, ${ref.company}` : ''}${ref.relationship ? ` • ${ref.relationship}` : ''}
                            </div>
                            <div class="item-description">
                                ${ref.email ? `<div><i class="fas fa-envelope"></i> ${ref.email}</div>` : ''}
                                ${ref.phone ? `<div><i class="fas fa-phone"></i> ${ref.phone}</div>` : ''}
                            </div>
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Custom Section
        if (this.data.customSection.title && this.data.customSection.items.length > 0) {
            html += `
                <div class="resume-section">
                    <h2>${this.data.customSection.title}</h2>
            `;
            
            this.data.customSection.items.forEach(item => {
                if (item.title) {
                    html += `
                        <div class="resume-item">
                            <h3>${item.title}</h3>
                            ${item.subtitle ? `<div class="item-meta">${item.subtitle}${item.date ? ` • ${this.formatDate(item.date)}` : ''}</div>` : ''}
                            ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                        </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        html += `</div>`;
        
        return html;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString + '-01');
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    formatDescription(description) {
        if (!description) return '';
        
        // Convert line breaks to <br> tags and handle bullet points
        return description
            .replace(/\n/g, '<br>')
            .replace(/^- (.+)$/gm, '<ul><li>$1</li></ul>')
            .replace(/<\/ul><br><ul>/g, '');
    }

    clearForm() {
        if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
            this.data = {
                personal: {},
                experience: [],
                education: [],
                skills: [],
                projects: [],
                certifications: [],
                languages: [],
                awards: [],
                references: [],
                customSection: {
                    title: '',
                    items: []
                }
            };
            
            // Clear all form inputs
            document.querySelectorAll('input, textarea, select').forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
            
            // Re-render everything
            this.renderSkillTags();
            this.renderExperienceList();
            this.renderEducationList();
            this.renderProjectList();
            this.renderCertificationList();
            this.renderLanguageList();
            this.renderAwardList();
            this.renderReferenceList();
            this.renderCustomSectionList();
            this.updateProgress();
            this.renderPreview();
            this.saveToStorage();
        }
    }

    downloadPDF() {
        const button = document.getElementById('downloadPdfBtn');
        button.classList.add('loading');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        
        setTimeout(() => {
            try {
                if (typeof downloadResumeAsPDF === 'function') {
                    const filename = this.data.personal.fullName 
                        ? `${this.data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
                        : 'Resume.pdf';
                    // Pass template and theme to preserve styling
                    downloadResumeAsPDF('resumePreview', this.currentTemplate, this.currentTheme, filename);
                }
            } catch (error) {
                console.error('PDF generation failed:', error);
                alert('Sorry, PDF generation failed. Please try again.');
            } finally {
                button.classList.remove('loading');
                button.innerHTML = '<i class="fas fa-download"></i> Download PDF';
            }
        }, 1000);
    }

    exportJSON() {
        const button = document.getElementById('exportJsonBtn');
        button.classList.add('loading');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting JSON...';
        
        setTimeout(() => {
            try {
                if (typeof downloadResumeAsJSON === 'function') {
                    const filename = this.data.personal.fullName 
                        ? `${this.data.personal.fullName.replace(/\s+/g, '_')}_Resume_Data.json`
                        : 'Resume_Data.json';
                    
                    const resumeData = {
                        currentTemplate: this.currentTemplate,
                        currentTheme: this.currentTheme,
                        data: this.data
                    };
                    
                    downloadResumeAsJSON(resumeData, filename);
                }
            } catch (error) {
                console.error('JSON export failed:', error);
                alert('Sorry, JSON export failed. Please try again.');
            } finally {
                button.classList.remove('loading');
                button.innerHTML = '<i class="fas fa-file-code"></i> Export JSON';
            }
        }, 500);
    }

    saveToStorage() {
        try {
            localStorage.setItem('resumeBuilderData', JSON.stringify({
                data: this.data,
                template: this.currentTemplate,
                theme: this.currentTheme
            }));
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('resumeBuilderData');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.data = parsed.data || this.data;
                this.currentTemplate = parsed.template || this.currentTemplate;
                this.currentTheme = parsed.theme || this.currentTheme;
                
                // Apply loaded template and theme
                this.selectTemplate(this.currentTemplate);
                this.selectTheme(this.currentTheme);
                
                // Populate form fields
                this.populateFormFields();
                
                // Render dynamic sections
                this.renderSkillTags();
                this.renderExperienceList();
                this.renderEducationList();
                this.renderProjectList();
                this.renderCertificationList();
                this.renderLanguageList();
                this.renderAwardList();
                this.renderReferenceList();
                this.renderCustomSectionList();
            }
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
        }
    }

    populateFormFields() {
        // Personal info
        Object.entries(this.data.personal).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.value = value || '';
            }
        });

        // Custom section title
        const customTitleElement = document.getElementById('customSectionTitle');
        if (customTitleElement) {
            customTitleElement.value = this.data.customSection.title || '';
        }
    }

    setupAutoSave() {
        setInterval(() => {
            this.saveToStorage();
        }, 10000); // Save every 10 seconds
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
    }
}

// Initialize the resume builder when the page loads
let resumeBuilder;
document.addEventListener('DOMContentLoaded', () => {
    resumeBuilder = new ResumeBuilder();
});
