// Check if im live
function checkTwitchLiveStatus() {
    fetch('https://decapi.me/twitch/uptime/kadenissilly')
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            var twitchLink = document.getElementById('live-indicator');
            
            if (twitchLink) {
                var isOffline = data.includes('offline') || data.includes('error') || data.trim() == '';
                
                switch(isOffline) {
                    case true:
                        twitchLink.classList.remove('live');
                        twitchLink.setAttribute('data-tooltip', 'Twitch');
                        break;
                    case false:
                        twitchLink.classList.add('live');
                        twitchLink.setAttribute('data-tooltip', 'LIVE');
                        break;
                }
            }
        })
        .catch(function(error) {
            console.log('Error checking Twitch status:', error);
        });
}

// Update age
function updateAge() {
    var birthDate = new Date('2007-04-16');
    var today = new Date();
    var birthYear = birthDate.getFullYear();
    var birthMonth = birthDate.getMonth();
    var birthDay = birthDate.getDate();
    var currentYear = today.getFullYear();
    var currentMonth = today.getMonth();
    var currentDay = today.getDate();

    var age = currentYear - birthYear;
    
    if (currentMonth < birthMonth) {
        age = age - 1;
    }

    if (currentMonth == birthMonth && currentDay < birthDay) {
        age = age - 1;
    }
    
    var article = '';
    var ageString = age.toString();
    
    switch(ageString) {
        case '18':
            article = 'an';
            break;
        default:
            article = 'a';
            break;
    }
    
    var ageElement = document.getElementById('age-count');

    if (ageElement) {
        ageElement.textContent = `${article} ${age} year old`;
    }
}

// Load projects
function loadProjects() {
    fetch('/utils/projects.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(projects) {
            var projectsGrid = document.getElementById('projects-grid');
            projectsGrid.innerHTML = '';
          
            for (var i = 0; i < projects.length; i++) {
                var project = projects[i];
                var projectCard = createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            }
        })
        .catch(function(error) {
            console.log('Error loading projects:', error);
            var projectsGrid = document.getElementById('projects-grid');
            projectsGrid.innerHTML = '<p class="error-text">Failed to load projects.</p>';
        });
}

// Make the project card
function createProjectCard(project) {
    var card = document.createElement('a');
    card.className = 'project-card';
    card.href = project.url;
    card.target = '_blank';
    
    var langSpans = '';

    for (var i = 0; i < project.languages.length; i++) {
        var lang = project.languages[i];
        var className = `code-${lang.toLowerCase()}`;
        langSpans = langSpans + `<span class="${className}">${lang}</span>`;

        if (i < project.languages.length - 1) {
            langSpans = langSpans + '/';
        }
    }
    
    card.innerHTML = `
        <img class="project-preview" src="${project.image}" alt="${project.name} Preview">
        <div class="project-info">
            <h2 class="project-name">${project.name}</h2>
            <p class="project-desc">${project.description}</p>
            <span class="project-code">${langSpans}</span>
            <span class="project-status">${project.status}</span>
        </div>
    `;
    
    return card;
}

// Start everything
document.addEventListener('DOMContentLoaded', function() {
    checkTwitchLiveStatus();
    updateAge();
    loadProjects();
});