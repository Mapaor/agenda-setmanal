document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const configToggle = document.getElementById('config-toggle');
    const shareToggle = document.getElementById('share-toggle');
    const sharePopup = document.getElementById('share-popup');
    const shareUrlInput = document.getElementById('share-url-input');
    const shareCopyBtn = document.getElementById('share-copy-btn');
    const calendarBody = document.getElementById('calendar-body');
    const modalOverlay = document.getElementById('modal-overlay');
    const configModalOverlay = document.getElementById('config-modal-overlay');
    
    // Event Form Inputs
    const eventForm = document.getElementById('event-form');
    const modalTitle = document.getElementById('modal-title');
    const btnCancel = document.getElementById('btn-cancel');
    const btnDelete = document.getElementById('btn-delete');
    const inputId = document.getElementById('event-id');
    const inputTitle = document.getElementById('event-name');
    const inputDay = document.getElementById('event-day');
    const inputStart = document.getElementById('event-start');
    const inputEnd = document.getElementById('event-end');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Config Form Inputs
    const configForm = document.getElementById('config-form');
    const configHideWeekend = document.getElementById('config-hide-weekend');
    const configStartHour = document.getElementById('config-start-hour');
    const configEndHour = document.getElementById('config-end-hour');
    const configPalette = document.getElementById('config-palette');
    const btnConfigCancel = document.getElementById('btn-config-cancel');
    
    // Constants
    // PIXELS_PER_HOUR is replaced by dynamic percentage scaling
    
    // State
    let events = JSON.parse(localStorage.getItem('agenda-events')) || [];
    let config = JSON.parse(localStorage.getItem('agenda-config')) || {
        hideWeekend: false,
        startHour: 7,
        endHour: 23,
        cellDesign: 'default',
        palette: 'vibrant'
    };
    let selectedColor = 'default';
    
    // Drag State
    let isDragging = false;
    let dragInitialMins = 0;
    let dragStartMins = 0;
    let dragEndMins = 0;
    let dragDay = null;
    let ghostElement = null;

    // Parse URL parameter if it exists
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    if (sharedData) {
        try {
            const parsedData = JSON.parse(decodeURIComponent(atob(sharedData)));
            if (parsedData.config && Array.isArray(parsedData.events)) {
                config = parsedData.config;
                events = parsedData.events;
                localStorage.setItem('agenda-config', JSON.stringify(config));
                localStorage.setItem('agenda-events', JSON.stringify(events));
            }
        } catch (e) {
            console.error('Failed to parse shared data:', e);
        }
        // Clean URL
        const url = new URL(window.location);
        url.searchParams.delete('data');
        window.history.replaceState({}, document.title, url.toString());
    }

    // Initialize
    initTheme();
    applyPalette();
    generateTimeOptions();
    initConfigUI();
    generateCalendarGrid();
    renderEvents();

    // Theme Toggle
    function initTheme() {
        const savedTheme = localStorage.getItem('agenda-theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('agenda-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const iconName = theme === 'dark' ? 'sun' : 'moon';
        themeToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function applyPalette() {
        document.documentElement.setAttribute('data-palette', config.palette || 'vibrant');
    }

    // Share Routine
    shareToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from immediately closing it
        
        if (sharePopup.classList.contains('active')) {
            sharePopup.classList.remove('active');
            return;
        }

        const dataToShare = {
            config: config,
            events: events
        };
        const jsonStr = JSON.stringify(dataToShare);
        const base64Str = btoa(encodeURIComponent(jsonStr));
        
        const url = new URL(window.location);
        url.searchParams.set('data', base64Str);
        
        shareUrlInput.value = url.toString();
        sharePopup.classList.add('active');
    });

    shareCopyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shareUrlInput.value).then(() => {
            shareCopyBtn.innerHTML = '<i data-lucide="check" style="color: #22c55e; width: 16px; height: 16px;"></i>';
            if (window.lucide) window.lucide.createIcons();
            
            setTimeout(() => {
                shareCopyBtn.innerHTML = '<i data-lucide="copy" style="width: 16px; height: 16px;"></i>';
                if (window.lucide) window.lucide.createIcons();
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy URL:', err);
            alert('Aquesta és la teva URL per compartir:\n' + shareUrlInput.value);
        });
    });

    // Close share popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!sharePopup.contains(e.target) && e.target !== shareToggle && !shareToggle.contains(e.target)) {
            sharePopup.classList.remove('active');
        }
    });

    // Config UI
    function initConfigUI() {
        for (let h = 0; h <= 24; h++) {
            const timeStr = `${h.toString().padStart(2, '0')}:00`;
            configStartHour.add(new Option(timeStr, h));
            configEndHour.add(new Option(timeStr, h));
        }
        
        configHideWeekend.checked = config.hideWeekend;
        configStartHour.value = config.startHour;
        configEndHour.value = config.endHour;
        configPalette.value = config.palette || 'vibrant';
        
        const selectedDesign = document.querySelector(`input[name="cell-design"][value="${config.cellDesign || 'default'}"]`);
        if (selectedDesign) selectedDesign.checked = true;

        configToggle.addEventListener('click', () => {
            configHideWeekend.checked = config.hideWeekend;
            configStartHour.value = config.startHour;
            configEndHour.value = config.endHour;
            configPalette.value = config.palette || 'vibrant';
            
            const selectedDesign = document.querySelector(`input[name="cell-design"][value="${config.cellDesign || 'default'}"]`);
            if (selectedDesign) selectedDesign.checked = true;
            
            configModalOverlay.classList.add('active');
        });

        btnConfigCancel.addEventListener('click', () => {
            configModalOverlay.classList.remove('active');
        });

        configModalOverlay.addEventListener('click', (e) => {
            if (e.target === configModalOverlay) configModalOverlay.classList.remove('active');
        });

        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const start = parseInt(configStartHour.value, 10);
            const end = parseInt(configEndHour.value, 10);
            
            if (start >= end) {
                return alert('L\'hora d\'inici ha de ser anterior a l\'hora final.');
            }

            config.hideWeekend = configHideWeekend.checked;
            config.startHour = start;
            config.endHour = end;
            config.cellDesign = document.querySelector('input[name="cell-design"]:checked').value;
            config.palette = configPalette.value;
            
            localStorage.setItem('agenda-config', JSON.stringify(config));
            
            configModalOverlay.classList.remove('active');
            applyPalette();
            generateCalendarGrid();
            renderEvents();
        });
    }

    // Generate Start and End time options for Event Modal
    function generateTimeOptions() {
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                const hh = h.toString().padStart(2, '0');
                const mm = m.toString().padStart(2, '0');
                const timeString = `${hh}:${mm}`;
                
                const optionStart = new Option(timeString, timeString);
                const optionEnd = new Option(timeString, timeString);
                
                inputStart.add(optionStart);
                inputEnd.add(optionEnd);
            }
        }
        // Add 24:00 option for end time
        inputEnd.add(new Option('24:00', '24:00'));
    }

    // Generate Calendar Grid
    function generateCalendarGrid() {
        calendarBody.innerHTML = '';
        
        const container = document.querySelector('.calendar-container');
        if (config.hideWeekend) {
            container.classList.add('hide-weekends');
        } else {
            container.classList.remove('hide-weekends');
        }

        const totalHours = config.endHour - config.startHour;
        const MIN_PIXELS_PER_HOUR = 45; // Ensures cells never get unreadably small
        calendarBody.style.minHeight = `${totalHours * MIN_PIXELS_PER_HOUR}px`;
        
        // Create time axis
        const timeAxis = document.createElement('div');
        timeAxis.className = 'time-axis';

        for (let h = config.startHour; h < config.endHour; h++) {
            const label = document.createElement('div');
            label.className = 'hour-label';
            label.style.top = `${((h - config.startHour) / totalHours) * 100}%`;
            if (h !== config.startHour) {
                label.textContent = `${h.toString().padStart(2, '0')}:00`;
            }
            timeAxis.appendChild(label);
        }
        calendarBody.appendChild(timeAxis);

        // Create 7 day columns
        for (let d = 0; d < 7; d++) {
            const dayCol = document.createElement('div');
            dayCol.className = 'day-column';
            dayCol.dataset.day = d;
            
            // Add grid lines and clickable slots
            for (let h = config.startHour; h < config.endHour; h++) {
                // Main hour line
                const hLine = document.createElement('div');
                hLine.className = 'hour-grid-line';
                hLine.style.top = `${((h - config.startHour) / totalHours) * 100}%`;
                dayCol.appendChild(hLine);
                
                for (let q = 0; q < 4; q++) {
                    // Clickable 15-min slot
                    const slot = document.createElement('div');
                    slot.className = 'time-slot';
                    const topPos = ((h - config.startHour + (q * 0.25)) / totalHours) * 100;
                    slot.style.top = `${topPos}%`;
                    slot.style.height = `${(0.25 / totalHours) * 100}%`;
                    
                    const timeString = `${h.toString().padStart(2, '0')}:${(q * 15).toString().padStart(2, '0')}`;
                    slot.dataset.time = timeString;
                    slot.dataset.day = d;
                    
                    slot.addEventListener('mousedown', (e) => {
                        e.preventDefault(); // prevent text selection
                        handleDragStart(d, timeString, dayCol);
                    });
                    
                    slot.addEventListener('mouseenter', (e) => {
                        handleDragMove(d, timeString);
                    });
                    
                    slot.addEventListener('touchstart', (e) => {
                        // don't preventDefault so user can still scroll if not dragging immediately
                        handleDragStart(d, timeString, dayCol);
                    }, { passive: true });
                    
                    slot.addEventListener('touchmove', (e) => {
                        if (isDragging) {
                            e.preventDefault(); // prevent scroll while dragging
                            const touch = e.touches[0];
                            const el = document.elementFromPoint(touch.clientX, touch.clientY);
                            if (el && el.classList.contains('time-slot')) {
                                handleDragMove(parseInt(el.dataset.day, 10), el.dataset.time);
                            }
                        }
                    }, { passive: false });
                    
                    dayCol.appendChild(slot);
                }
            }
            calendarBody.appendChild(dayCol);
        }
    }

    // Dragging Logic
    function handleDragStart(dayIndex, timeString, dayColElement) {
        isDragging = true;
        dragDay = dayIndex;
        dragInitialMins = timeToMins(timeString);
        dragStartMins = dragInitialMins;
        dragEndMins = dragInitialMins + 15;

        ghostElement = document.createElement('div');
        ghostElement.className = 'event event-ghost';
        ghostElement.style.pointerEvents = 'none';
        dayColElement.appendChild(ghostElement);
        
        updateGhostElement();
    }

    function handleDragMove(dayIndex, timeString) {
        if (isDragging && dayIndex === dragDay) {
            let hoverMins = timeToMins(timeString);
            dragStartMins = Math.min(dragInitialMins, hoverMins);
            dragEndMins = Math.max(dragInitialMins, hoverMins) + 15;
            updateGhostElement();
        }
    }

    function handleDragEnd() {
        if (isDragging) {
            isDragging = false;
            
            let startStr = minsToTime(dragStartMins);
            let endStr = dragEndMins === dragInitialMins + 15 ? null : minsToTime(dragEndMins);
            
            openModalForNew(dragDay, startStr, endStr);
        }
    }

    function updateGhostElement() {
        if (!ghostElement) return;
        const totalHours = config.endHour - config.startHour;
        const configStartMins = config.startHour * 60;
        
        const topPos = ((dragStartMins - configStartMins) / (totalHours * 60)) * 100;
        const height = ((dragEndMins - dragStartMins) / (totalHours * 60)) * 100;
        
        ghostElement.style.top = `${topPos}%`;
        ghostElement.style.height = `${height}%`;
        ghostElement.innerHTML = '';
    }

    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);

    // Modal logic
    function openModalForNew(dayIndex, startTime, endTime = null) {
        modalTitle.textContent = 'Nova rutina';
        inputId.value = '';
        inputTitle.value = '';
        inputDay.value = dayIndex;
        inputStart.value = startTime;
        
        if (endTime) {
            inputEnd.value = endTime;
        } else {
            let [startH, startM] = startTime.split(':').map(Number);
            let endH = startH + 1;
            let endM = startM;
            if (endH >= Math.min(24, config.endHour)) {
                endH = Math.min(24, config.endHour);
                endM = 0;
                // if duration is 0 because they clicked on the very last hour
                if (endH === startH && endM === startM) {
                     endH = 24; 
                }
            }
            inputEnd.value = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
        }
        
        selectColor('default');
        btnDelete.style.display = 'none';
        modalOverlay.classList.add('active');
        inputTitle.focus();
    }

    function openModalForEdit(event) {
        modalTitle.textContent = 'Edita la rutina';
        inputId.value = event.id;
        inputTitle.value = event.title;
        inputDay.value = event.day;
        inputStart.value = event.start;
        inputEnd.value = event.end;
        
        selectColor(event.color);
        btnDelete.style.display = 'block';
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        if (ghostElement) {
            ghostElement.remove();
            ghostElement = null;
        }
    }

    // Color picker logic
    colorOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            selectColor(opt.dataset.color);
        });
    });

    function selectColor(color) {
        selectedColor = color;
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        const selectedEl = document.querySelector(`.color-option[data-color="${color}"]`);
        if (selectedEl) selectedEl.classList.add('selected');
    }

    // Form Submissions
    btnCancel.addEventListener('click', closeModal);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    btnDelete.addEventListener('click', () => {
        const idToRemove = inputId.value;
        if (idToRemove) {
            events = events.filter(e => e.id !== idToRemove);
            saveEvents();
            renderEvents();
            closeModal();
        }
    });

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = inputId.value || Date.now().toString();
        const title = inputTitle.value.trim();
        const day = parseInt(inputDay.value, 10);
        const start = inputStart.value;
        const end = inputEnd.value;
        
        if (!title) return alert('El títol és obligatori');
        
        const startTotalMins = timeToMins(start);
        const endTotalMins = timeToMins(end);
        
        if (startTotalMins >= endTotalMins) {
            return alert('L\'hora final ha de ser posterior a l\'hora d\'inici');
        }

        const newEvent = {
            id,
            title,
            day,
            start,
            end,
            color: selectedColor
        };

        events = events.filter(e => e.id !== id);
        events.push(newEvent);
        
        saveEvents();
        renderEvents();
        closeModal();
    });

    // Event Rendering
    function saveEvents() {
        localStorage.setItem('agenda-events', JSON.stringify(events));
    }

    function timeToMins(timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    }

    function minsToTime(mins) {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    function renderEvents() {
        document.querySelectorAll('.event').forEach(el => el.remove());
        const totalHours = config.endHour - config.startHour;

        events.forEach(event => {
            const dayCol = document.querySelector(`.day-column[data-day="${event.day}"]`);
            if (!dayCol) return;

            const startMins = timeToMins(event.start);
            const endMins = timeToMins(event.end);
            
            // Skip events completely out of the config time window
            const configStartMins = config.startHour * 60;
            const configEndMins = config.endHour * 60;
            if (endMins <= configStartMins || startMins >= configEndMins) {
                return; 
            }

            const durationMins = endMins - startMins;

            // Offset topPos by the configured startHour
            const topPos = ((startMins - configStartMins) / (totalHours * 60)) * 100;
            const height = (durationMins / (totalHours * 60)) * 100;

            const eventEl = document.createElement('div');
            eventEl.className = `event bg-${event.color}`;
            eventEl.style.top = `${topPos}%`;
            eventEl.style.height = `${height}%`;
            
            const titleEl = document.createElement('div');
            titleEl.className = 'event-title';
            titleEl.textContent = event.title;
            
            const timeEl = document.createElement('div');
            timeEl.className = 'event-time';
            timeEl.textContent = `${event.start} - ${event.end}`;
            
            eventEl.appendChild(titleEl);
            
            if (config.cellDesign === 'centered') {
                eventEl.classList.add('event-centered');
            } else if (durationMins >= 30) {
                eventEl.appendChild(timeEl);
            }

            eventEl.addEventListener('click', (e) => {
                e.stopPropagation();
                openModalForEdit(event);
            });

            dayCol.appendChild(eventEl);
        });
    }
});
