document.addEventListener('DOMContentLoaded', () => {
    // --- STATE & currentPage ---
    let currentPage = 'home';
    let entryUserDetails = null;
    let currentEditingStudentId = null; // For student edit

    // --- DOM Elements ---
    const pageContent = document.getElementById('page-content');
    const appContainer = document.getElementById('app-container');
    const entryFormContainer = document.getElementById('entry-form-container');
    const navContainer = document.querySelector('nav');
    const userWelcomeInfo = document.getElementById('user-welcome-info');
    const headerLeafIcon = document.getElementById('header-leaf-icon');

    // Modal Elements
    const detailModalContainer = document.getElementById('detail-modal-container');
    const detailModalBody = document.getElementById('detail-modal-body');
    const detailModalCloseBtn = document.getElementById('detail-modal-close');

    const formModalContainer = document.getElementById('form-modal-container');
    const formModalBody = document.getElementById('form-modal-body');
    const formModalCloseBtn = document.getElementById('form-modal-close');


    // --- ICONS (SVG strings) ---
    const ICONS = {
        home: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
        book: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>',
        users: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        clipboard: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
        bell: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>',
        leaf: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10zM2 13a10 10 0 0 1 10-10C12 3 12 3 12 3a10 10 0 0 0 10 10h-2a7 7 0 0 1-7 7V3z"></path></svg>',
        plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
        mapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
        trash: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
        edit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        search: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        login: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>',
        mail: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
        phone: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
        facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
        userCheck: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>',
    };
    headerLeafIcon.innerHTML = ICONS.leaf;


    // --- LocalStorage Helper ---
    const getData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
    const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));
    const generateId = () => crypto.randomUUID();

    // --- Date/Time Formatting ---
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('bn-BD', options);
    };
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const date = new Date();
        date.setHours(hour, parseInt(minutes));
        return date.toLocaleTimeString('bn-BD', { hour: 'numeric', minute: 'numeric', hour12: true });
    };
    const isClassExpired = (classDate, classTime) => {
        if (!classDate || !classTime) return false;
        const classDateTime = new Date(`${classDate}T${classTime}`);
        return classDateTime < new Date();
    };
    const isExamExpired = (examDate) => {
        if (!examDate) return false;
        const examDateTime = new Date(examDate);
        const today = new Date();
        today.setHours(0,0,0,0); // Compare with the beginning of today
        return examDateTime < today;
    };
    
    const plantCategoriesList = [
        { value: 'ফল', label: 'ফলের গাছ' }, { value: 'ঔষধি', label: 'ঔষধি গাছ' },
        { value: 'ফুল', label: 'ফুলের গাছ' }, { value: 'শৈবাল', label: 'শৈবাল' },
        { value: 'ছত্রাক', label: 'ছত্রাক' }, { value: 'ব্রায়োফাইট', label: 'ব্রায়োফাইট' },
        { value: 'টেরিডোফাইট', label: 'টেরিডোফাইট' }, { value: 'অন্যান্য', label: 'অন্যান্য' },
    ];

    const getPlantCategoryLabel = (value) => {
        const category = plantCategoriesList.find(cat => cat.value === value);
        return category ? category.label : value;
    };


    // --- Modals ---
    function openModal(modalContainer) {
        modalContainer.classList.add('active');
    }
    function closeModal(modalContainer) {
        modalContainer.classList.remove('active');
    }

    detailModalCloseBtn.addEventListener('click', () => closeModal(detailModalContainer));
    formModalCloseBtn.addEventListener('click', () => closeModal(formModalContainer));
    // Close modal if clicked outside content
    [detailModalContainer, formModalContainer].forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    function showDetails(item, type) {
        let content = '';
        switch (type) {
            case 'class':
                content = `<h3>${item.subject}</h3>
                           <p>${item.description}</p>
                           <p><strong>তারিখ:</strong> ${formatDate(item.date)}</p>
                           <p><strong>সময়:</strong> ${formatTime(item.time)}</p>
                           ${item.createdBy ? `<p class="text-sm text-gray-500 mt-1">যোগ করেছেন: ${item.createdBy}</p>` : ''}`;
                break;
            case 'exam':
                content = `<h3>${item.subject}</h3>
                           <p><strong>পরীক্ষার সময়:</strong> ${item.time}</p>
                           <p><strong>তারিখ:</strong> ${formatDate(item.date)}</p>
                           <p><strong>রুম:</strong> ${item.room}</p>
                           ${item.createdBy ? `<p class="text-sm text-gray-500 mt-1">যোগ করেছেন: ${item.createdBy}</p>` : ''}`;
                break;
            case 'notice':
                content = `<h3>${item.title}</h3>
                           <p>${item.description}</p>
                           <p><strong>ক্যাটাগরি:</strong> ${item.category}</p>
                           <p><strong>তারিখ:</strong> ${formatDate(item.date)}</p>
                           ${item.createdBy ? `<p class="text-sm text-gray-500 mt-1">যোগ করেছেন: ${item.createdBy}</p>` : ''}`;
                break;
            case 'plant':
                content = `<h3>${item.name}</h3>
                           <p class="italic text-gray-600 mb-1">${item.scientificName}</p>
                           ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://placehold.co/400x200/E0E0E0/888888?text=${encodeURIComponent(item.name)}';">` : ''}
                           <p>${item.description}</p>
                           <p><strong>উচ্চতা:</strong> ${item.height || 'N/A'}</p>
                           <p><strong>বয়স:</strong> ${item.age || 'N/A'}</p>
                           <p><strong>ক্যাটাগরি:</strong> ${getPlantCategoryLabel(item.category)}</p>
                           ${item.createdBy ? `<p class="text-sm text-gray-500 mt-1">যোগ করেছেন: ${item.createdBy}</p>` : ''}`;
                break;
            case 'student':
                content = `<div class="text-center">
                             <h3>${item.name}</h3>
                             ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" class="student-modal-img" style="width:100px; height:100px; border-radius:50%; margin:10px auto; object-fit:cover;" onerror="this.src='https://placehold.co/100x100/E0E0E0/888888?text=${encodeURIComponent(item.name.charAt(0))}';">` : ''}
                           </div>
                           <p><strong>পিতার নাম:</strong> ${item.fatherName}</p>
                           <p><strong>রোল:</strong> ${item.roll}</p>
                           <p><strong>রেজিস্ট্রেশন:</strong> ${item.reg}</p>
                           ${item.bio ? `<p><strong>বায়ো:</strong> ${item.bio}</p>` : ''}
                           ${item.email ? `<p><strong>ইমেইল:</strong> <a href="mailto:${item.email}">${item.email}</a></p>` : ''}
                           ${item.phone ? `<p><strong>ফোন:</strong> <a href="tel:${item.phone}">${item.phone}</a></p>` : ''}
                           ${item.facebookId ? `<p><strong>ফেসবুক:</strong> <a href="${item.facebookId.startsWith('http') ? item.facebookId : `https://facebook.com/${item.facebookId}`}" target="_blank" rel="noopener noreferrer">${item.facebookId.startsWith('http') ? 'প্রোফাইল লিংক' : item.facebookId}</a></p>` : ''}`;
                break;
        }
        detailModalBody.innerHTML = content;
        openModal(detailModalContainer);
    }

    // --- Render Functions ---
    function renderHomePage() {
        pageContent.innerHTML = `
            <section class="hero-section">
                <h1>উদ্ভিদবিদ্যা বিভাগ</h1>
                <p>প্রকৃতির রহস্য উন্মোচন করুন, সবুজ ভবিষ্যতের জন্য জ্ঞান অর্জন করুন।</p>
            </section>
            <section id="home-recent-notice"></section>
            <section id="home-next-classes"></section>
            <section id="home-next-exams"></section>
        `;

        const notices = getData('notices').sort((a,b) => new Date(b.date) - new Date(a.date));
        const recentNotice = notices.length > 0 ? notices[0] : null;
        const homeRecentNoticeEl = document.getElementById('home-recent-notice');
        if (recentNotice) {
            homeRecentNoticeEl.innerHTML = `
                <h2>সাম্প্রতিক নোটিশ</h2>
                <div class="info-block">
                    <h3>${ICONS.bell} ${recentNotice.title}</h3>
                    <p class="card-text">${recentNotice.description.substring(0,150)}${recentNotice.description.length > 150 ? '...' : ''}</p>
                    <p class="card-meta">তারিখ: ${formatDate(recentNotice.date)}</p>
                    ${recentNotice.createdBy ? `<p class="text-xs text-gray-500">যোগ করেছেন: ${recentNotice.createdBy}</p>` : ''}
                    <button class="btn btn-secondary btn-sm" data-item-id="${recentNotice.id}" data-item-type="notice">বিস্তারিত</button>
                    <button class="btn btn-gray btn-sm" id="view-all-notices">সকল নোটিশ দেখুন</button>
                </div>`;
            homeRecentNoticeEl.querySelector('[data-item-id]').addEventListener('click', () => showDetails(recentNotice, 'notice'));
            homeRecentNoticeEl.querySelector('#view-all-notices').addEventListener('click', () => navigateTo('notice'));

        } else {
            homeRecentNoticeEl.innerHTML = '<h2>সাম্প্রতিক নোটিশ</h2><p>কোনো সাম্প্রতিক নোটিশ নেই।</p>';
        }

        const classes = getData('classes');
        const futureClasses = classes.filter(cls => !isClassExpired(cls.date, cls.time))
                                  .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
                                  .slice(0, 3);
        const homeNextClassesEl = document.getElementById('home-next-classes');
        homeNextClassesEl.innerHTML = '<h2>পরবর্তী ক্লাস</h2>';
        if (futureClasses.length > 0) {
            const classGrid = document.createElement('div');
            classGrid.className = 'grid-container';
            futureClasses.forEach(cls => {
                const div = document.createElement('div');
                div.className = 'info-block';
                div.innerHTML = `
                    <h3>${ICONS.calendar} ${cls.subject}</h3>
                    <p class="card-meta"><span>${formatDate(cls.date)}</span> - <span>${formatTime(cls.time)}</span></p>
                    ${cls.createdBy ? `<p class="text-xs text-gray-500">যোগ করেছেন: ${cls.createdBy}</p>` : ''}
                    <button class="btn btn-secondary btn-sm" data-item-id="${cls.id}" data-item-type="class">বিস্তারিত</button>`;
                div.querySelector('button').addEventListener('click', () => showDetails(cls, 'class'));
                classGrid.appendChild(div);
            });
            homeNextClassesEl.appendChild(classGrid);
        } else {
            homeNextClassesEl.innerHTML += '<p>কোনো পরবর্তী ক্লাস নেই।</p>';
        }

        const exams = getData('exams');
        const futureExams = exams.filter(exam => !isExamExpired(exam.date))
                               .sort((a, b) => new Date(a.date) - new Date(b.date))
                               .slice(0, 2);
        const homeNextExamsEl = document.getElementById('home-next-exams');
        homeNextExamsEl.innerHTML = '<h2>পরবর্তী পরীক্ষা</h2>';
        if (futureExams.length > 0) {
            const examGrid = document.createElement('div');
            examGrid.className = 'grid-container'; // Can be a 2-column grid if desired
            futureExams.forEach(exam => {
                const div = document.createElement('div');
                div.className = 'info-block';
                div.innerHTML = `
                    <h3>${ICONS.clipboard} ${exam.subject}</h3>
                    <p class="card-meta">
                        <span>${formatDate(exam.date)}</span>
                        <span>${ICONS.mapPin} ${exam.room}</span>
                    </p>
                    ${exam.createdBy ? `<p class="text-xs text-gray-500">যোগ করেছেন: ${exam.createdBy}</p>` : ''}
                    <button class="btn btn-secondary btn-sm" data-item-id="${exam.id}" data-item-type="exam">বিস্তারিত</button>`;
                div.querySelector('button').addEventListener('click', () => showDetails(exam, 'exam'));
                examGrid.appendChild(div);
            });
            homeNextExamsEl.appendChild(examGrid);
        } else {
            homeNextExamsEl.innerHTML += '<p>কোনো পরবর্তী পরীক্ষা নেই।</p>';
        }
    }

    function renderClassPage() {
        pageContent.innerHTML = `
            <div class="page-header">
                <h2>ক্লাস আপডেট</h2>
                <button id="addClassBtn" class="btn btn-primary add-new-btn">${ICONS.plus} নতুন ক্লাস যোগ করুন</button>
            </div>
            <div id="classList" class="grid-container"></div>`;
        
        const classes = getData('classes').sort((a, b) => { 
            const aExpired = isClassExpired(a.date, a.time); 
            const bExpired = isClassExpired(b.date, b.time); 
            if (aExpired && !bExpired) return 1; 
            if (!aExpired && bExpired) return -1; 
            return new Date(b.date) - new Date(a.date) || new Date(b.time) - new Date(a.time); 
        });
        
        const classListEl = document.getElementById('classList');
        classListEl.innerHTML = ''; // Clear previous
        if (classes.length === 0) {
            classListEl.innerHTML = '<p>কোনো ক্লাস আপডেট নেই।</p>';
        } else {
            classes.forEach(cls => {
                const div = document.createElement('div');
                const expired = isClassExpired(cls.date, cls.time);
                div.className = `card ${expired ? 'expired' : ''}`;
                div.innerHTML = `
                    <h4 class="card-title">${cls.subject}</h4>
                    <p class="card-meta">${formatDate(cls.date)} - ${formatTime(cls.time)}</p>
                    <p class="card-text">${cls.description.substring(0,100)}${cls.description.length > 100 ? '...' : ''}</p>
                    ${cls.createdBy ? `<p class="text-xs text-gray-500">যোগ করেছেন: ${cls.createdBy}</p>` : ''}
                    ${expired ? '<span class="text-xs text-red-600">শেষ হয়েছে</span>' : ''}
                    <div class="card-actions">
                        <button class="btn btn-info btn-sm details-btn">${ICONS.info} বিস্তারিত</button>
                        <button class="btn btn-danger btn-sm delete-btn">${ICONS.trash} মুছুন</button>
                    </div>`;
                div.querySelector('.details-btn').addEventListener('click', () => showDetails(cls, 'class'));
                div.querySelector('.delete-btn').addEventListener('click', () => {
                    if (confirm('আপনি কি এই ক্লাসটি মুছে ফেলতে চান?')) {
                        const updatedClasses = getData('classes').filter(c => c.id !== cls.id);
                        setData('classes', updatedClasses);
                        renderClassPage(); // Re-render
                    }
                });
                classListEl.appendChild(div);
            });
        }
        document.getElementById('addClassBtn').addEventListener('click', showClassForm);
    }

    function showClassForm() {
        formModalBody.innerHTML = `
            <h3>নতুন ক্লাস আপডেট</h3>
            <form id="classForm">
                <div class="form-group">
                    <label for="classDate">তারিখ</label>
                    <input type="date" id="classDate" required>
                </div>
                <div class="form-group">
                    <label for="classTime">সময়</label>
                    <input type="time" id="classTime" required>
                </div>
                <div class="form-group">
                    <label for="classSubject">বিষয়</label>
                    <input type="text" id="classSubject" placeholder="বিষয়ের নাম" required>
                </div>
                <div class="form-group">
                    <label for="classDescription">বর্ণনা</label>
                    <textarea id="classDescription" placeholder="ক্লাস সম্পর্কে বিস্তারিত" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-gray" id="cancelClassForm">বাতিল</button>
                    <button type="submit" class="btn btn-primary">যোগ করুন</button>
                </div>
            </form>`;
        openModal(formModalContainer);

        const classForm = document.getElementById('classForm');
        classForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newClass = {
                id: generateId(),
                date: document.getElementById('classDate').value,
                time: document.getElementById('classTime').value,
                subject: document.getElementById('classSubject').value,
                description: document.getElementById('classDescription').value,
                createdBy: entryUserDetails ? `${entryUserDetails.name} (রোল: ${entryUserDetails.roll})` : 'Unknown'
            };
            const classes = getData('classes');
            classes.push(newClass);
            setData('classes', classes);
            closeModal(formModalContainer);
            renderClassPage();
        });
        document.getElementById('cancelClassForm').addEventListener('click', () => closeModal(formModalContainer));
    }

    function renderExamPage() {
        pageContent.innerHTML = `
            <div class="page-header">
                <h2>পরীক্ষার আপডেট</h2>
                <button id="addExamBtn" class="btn btn-primary add-new-btn">${ICONS.plus} নতুন পরীক্ষা যোগ করুন</button>
            </div>
            <div id="examList" class="grid-container"></div>`;

        const exams = getData('exams').sort((a, b) => {
            const aExpired = isExamExpired(a.date); 
            const bExpired = isExamExpired(b.date); 
            if (aExpired && !bExpired) return 1; 
            if (!aExpired && bExpired) return -1; 
            return new Date(b.date) - new Date(a.date);
        });
        
        const examListEl = document.getElementById('examList');
        examListEl.innerHTML = '';
        if (exams.length === 0) {
            examListEl.innerHTML = '<p>কোনো পরীক্ষার আপডেট নেই।</p>';
        } else {
            exams.forEach(exam => {
                const div = document.createElement('div');
                const expired = isExamExpired(exam.date);
                div.className = `card ${expired ? 'expired' : ''}`;
                div.innerHTML = `
                    <h4 class="card-title">${exam.subject}</h4>
                    <p class="card-meta">${formatDate(exam.date)}</p>
                    <p class="card-text">সময়: ${exam.time}</p>
                    <p class="card-text">রুম: ${exam.room}</p>
                    ${exam.createdBy ? `<p class="text-xs text-gray-500">যোগ করেছেন: ${exam.createdBy}</p>` : ''}
                    ${expired ? '<span class="text-xs text-red-600">শেষ হয়েছে</span>' : ''}
                    <div class="card-actions">
                        <button class="btn btn-info btn-sm details-btn">${ICONS.info} বিস্তারিত</button>
                        <button class="btn btn-danger btn-sm delete-btn">${ICONS.trash} মুছুন</button>
                    </div>`;
                div.querySelector('.details-btn').addEventListener('click', () => showDetails(exam, 'exam'));
                div.querySelector('.delete-btn').addEventListener('click', () => {
                    if (confirm('আপনি কি এই পরীক্ষাটি মুছে ফেলতে চান?')) {
                        const updatedExams = getData('exams').filter(ex => ex.id !== exam.id);
                        setData('exams', updatedExams);
                        renderExamPage();
                    }
                });
                examListEl.appendChild(div);
            });
        }
        document.getElementById('addExamBtn').addEventListener('click', showExamForm);
    }

    function showExamForm() {
        formModalBody.innerHTML = `
            <h3>নতুন পরীক্ষা যোগ করুন</h3>
            <form id="examForm">
                <div class="form-group">
                    <label for="examDate">তারিখ</label>
                    <input type="date" id="examDate" required>
                </div>
                <div class="form-group">
                    <label for="examSubject">পরীক্ষা/বিষয় নাম</label>
                    <input type="text" id="examSubject" placeholder="পরীক্ষার নাম" required>
                </div>
                <div class="form-group">
                    <label for="examTime">সময়</label>
                    <input type="text" id="examTime" placeholder="সকাল ১০টা - দুপুর ১টা" required>
                </div>
                <div class="form-group">
                    <label for="examRoom">রুম</label>
                    <input type="text" id="examRoom" placeholder="রুম নাম্বার" required>
                </div>
                <div class="form-actions">
                     <button type="button" class="btn btn-gray" id="cancelExamForm">বাতিল</button>
                    <button type="submit" class="btn btn-primary">যোগ করুন</button>
                </div>
            </form>`;
        openModal(formModalContainer);

        document.getElementById('examForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const newExam = {
                id: generateId(),
                date: document.getElementById('examDate').value,
                subject: document.getElementById('examSubject').value,
                time: document.getElementById('examTime').value,
                room: document.getElementById('examRoom').value,
                createdBy: entryUserDetails ? `${entryUserDetails.name} (রোল: ${entryUserDetails.roll})` : 'Unknown'
            };
            const exams = getData('exams');
            exams.push(newExam);
            setData('exams', exams);
            closeModal(formModalContainer);
            renderExamPage();
        });
        document.getElementById('cancelExamForm').addEventListener('click', () => closeModal(formModalContainer));
    }
    
    function renderNoticePage(filterCategory = 'সকল নোটিশ') {
        pageContent.innerHTML = `
            <div class="page-header">
                <h2>নোটিশ বোর্ড</h2>
                <button id="addNoticeBtn" class="btn btn-primary add-new-btn">${ICONS.plus} নতুন নোটিশ</button>
            </div>
            <div id="noticeFilters" class="filters-container"></div>
            <div id="noticeList"></div>`;

        const noticeFiltersEl = document.getElementById('noticeFilters');
        const categories = ['সকল নোটিশ', 'একাডেমিক', 'পরীক্ষা', 'ক্লাস রুটিন', 'ইভেন্ট', 'সেমিনার'];
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = cat;
            if (cat === filterCategory) btn.classList.add('active');
            btn.addEventListener('click', () => renderNoticePage(cat));
            noticeFiltersEl.appendChild(btn);
        });

        const notices = getData('notices').sort((a,b) => new Date(b.date) - new Date(a.date));
        const filteredNotices = filterCategory === 'সকল নোটিশ' ? notices : notices.filter(n => n.category === filterCategory);
        
        const noticeListEl = document.getElementById('noticeList');
        noticeListEl.innerHTML = '';
        if (filteredNotices.length === 0) {
            noticeListEl.innerHTML = '<p>এই ক্যাটাগরিতে কোনো নোটিশ নেই।</p>';
        } else {
            filteredNotices.forEach(notice => {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `
                    <span class="text-xs text-green-600 font-bold">${notice.category}</span>
                    <h4 class="card-title">${notice.title}</h4>
                    <p class="card-meta">${formatDate(notice.date)}</p>
                    <p class="card-text">${notice.description.substring(0,150)}${notice.description.length > 150 ? '...' : ''}</p>
                    ${notice.createdBy ? `<p class="text-xs text-gray-500">যোগ করেছেন: ${notice.createdBy}</p>` : ''}
                    <div class="card-actions">
                        <button class="btn btn-info btn-sm details-btn">${ICONS.info} বিস্তারিত</button>
                        <button class="btn btn-danger btn-sm delete-btn">${ICONS.trash} মুছুন</button>
                    </div>`;
                div.querySelector('.details-btn').addEventListener('click', () => showDetails(notice, 'notice'));
                div.querySelector('.delete-btn').addEventListener('click', () => {
                    if (confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
                        const updatedNotices = getData('notices').filter(n => n.id !== notice.id);
                        setData('notices', updatedNotices);
                        renderNoticePage(filterCategory);
                    }
                });
                noticeListEl.appendChild(div);
            });
        }
        document.getElementById('addNoticeBtn').addEventListener('click', showNoticeForm);
    }

    function showNoticeForm() {
        formModalBody.innerHTML = `
            <h3>নতুন নোটিশ যোগ করুন</h3>
            <form id="noticeForm">
                <div class="form-group">
                    <label for="noticeCategory">ক্যাটাগরি</label>
                    <select id="noticeCategory" required>
                        <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                        <option value="একাডেমিক">একাডেমিক</option>
                        <option value="পরীক্ষা">পরীক্ষা</option>
                        <option value="ক্লাস রুটিন">ক্লাস রুটিন</option>
                        <option value="ইভেন্ট">ইভেন্ট</option>
                        <option value="সেমিনার">সেমিনার</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="noticeDate">তারিখ</label>
                    <input type="date" id="noticeDate" required>
                </div>
                <div class="form-group">
                    <label for="noticeTitle">শিরোনাম</label>
                    <input type="text" id="noticeTitle" placeholder="নোটিশের শিরোনাম" required>
                </div>
                <div class="form-group">
                    <label for="noticeDescription">বর্ণনা</label>
                    <textarea id="noticeDescription" placeholder="নোটিশের বিস্তারিত" required></textarea>
                </div>
                <div class="form-actions">
                     <button type="button" class="btn btn-gray" id="cancelNoticeForm">বাতিল</button>
                    <button type="submit" class="btn btn-primary">যোগ করুন</button>
                </div>
            </form>`;
        openModal(formModalContainer);

        document.getElementById('noticeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const newNotice = {
                id: generateId(),
                category: document.getElementById('noticeCategory').value,
                date: document.getElementById('noticeDate').value,
                title: document.getElementById('noticeTitle').value,
                description: document.getElementById('noticeDescription').value,
                createdBy: entryUserDetails ? `${entryUserDetails.name} (রোল: ${entryUserDetails.roll})` : 'Unknown'
            };
            const notices = getData('notices');
            notices.push(newNotice);
            setData('notices', notices);
            closeModal(formModalContainer);
            renderNoticePage();
        });
        document.getElementById('cancelNoticeForm').addEventListener('click', () => closeModal(formModalContainer));
    }

    function renderStudentInfoPage() {
        pageContent.innerHTML = `
            <div class="page-header">
                <h2>ছাত্র-ছাত্রীদের তথ্য</h2>
                <button id="addStudentBtn" class="btn btn-primary add-new-btn">${ICONS.plus} নতুন ছাত্র যোগ করুন</button>
            </div>
            <div id="studentList" class="grid-container"></div>`;

        const students = getData('students');
        const studentListEl = document.getElementById('studentList');
        studentListEl.innerHTML = '';
        if (students.length === 0) {
            studentListEl.innerHTML = '<p>কোনো ছাত্র-ছাত্রীর তথ্য নেই।</p>';
        } else {
            students.forEach(student => {
                const div = document.createElement('div');
                div.className = 'card student-card'; // Added student-card for specific styling
                div.innerHTML = `
                    <img src="${student.imageUrl || `https://placehold.co/100x100/E0E0E0/888888?text=${encodeURIComponent(student.name.charAt(0))}`}" alt="${student.name}" onerror="this.src='https://placehold.co/100x100/E0E0E0/888888?text=${encodeURIComponent(student.name.charAt(0))}';">
                    <h4 class="card-title">${student.name}</h4>
                    <p class="card-text">পিতার নাম: ${student.fatherName}</p>
                    <p class="card-text">রোলঃ ${student.roll} | রেজিঃ ${student.reg}</p>
                    ${student.bio ? `<p class="card-text text-sm text-gray-600">${student.bio.substring(0,50)}${student.bio.length > 50 ? '...' : ''}</p>` : ''}
                    <div class="student-contact-info mt-1">
                        ${student.email ? `<div>${ICONS.mail} <a href="mailto:${student.email}">${student.email}</a></div>` : ''}
                        ${student.phone ? `<div>${ICONS.phone} <a href="tel:${student.phone}">${student.phone}</a></div>` : ''}
                        ${student.facebookId ? `<div>${ICONS.facebook} <a href="${student.facebookId.startsWith('http') ? student.facebookId : `https://facebook.com/${student.facebookId}`}" target="_blank">${student.facebookId.startsWith('http') ? 'ফেসবুক' : student.facebookId}</a></div>` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-info btn-sm details-btn">${ICONS.info} বিস্তারিত</button>
                        <button class="btn btn-warning btn-sm edit-btn">${ICONS.edit} সম্পাদনা</button>
                        <button class="btn btn-danger btn-sm delete-btn">${ICONS.trash} মুছুন</button>
                    </div>`;
                div.querySelector('.details-btn').addEventListener('click', () => showDetails(student, 'student'));
                div.querySelector('.edit-btn').addEventListener('click', () => showStudentForm(student));
                div.querySelector('.delete-btn').addEventListener('click', () => {
                    if (confirm('আপনি কি এই ছাত্র/ছাত্রীর তথ্য মুছে ফেলতে চান?')) {
                        const updatedStudents = getData('students').filter(s => s.id !== student.id);
                        setData('students', updatedStudents);
                        renderStudentInfoPage();
                    }
                });
                studentListEl.appendChild(div);
            });
        }
        document.getElementById('addStudentBtn').addEventListener('click', () => showStudentForm());
    }

    function showStudentForm(studentToEdit = null) {
        currentEditingStudentId = studentToEdit ? studentToEdit.id : null;
        formModalBody.innerHTML = `
            <h3>${studentToEdit ? 'ছাত্রের তথ্য সম্পাদনা করুন' : 'নতুন ছাত্র যোগ করুন'}</h3>
            <form id="studentForm">
                <div class="form-group">
                    <label for="studentName">নাম <span class="text-red-600">*</span></label>
                    <input type="text" id="studentName" value="${studentToEdit?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="studentRoll">রোল <span class="text-red-600">*</span></label>
                    <input type="text" id="studentRoll" value="${studentToEdit?.roll || ''}" required>
                </div>
                <div class="form-group">
                    <label for="studentReg">রেজিস্ট্রেশন <span class="text-red-600">*</span></label>
                    <input type="text" id="studentReg" value="${studentToEdit?.reg || ''}" required>
                </div>
                <div class="form-group">
                    <label for="studentBio">সংক্ষিপ্ত বায়ো</label>
                    <textarea id="studentBio">${studentToEdit?.bio || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="studentImageUrl">ছবির URL</label>
                    <input type="url" id="studentImageUrl" placeholder="https://example.com/image.jpg" value="${studentToEdit?.imageUrl || ''}">
                </div>
                 <div class="form-group">
                    <label for="studentEmail">ইমেইল</label>
                    <input type="email" id="studentEmail" value="${studentToEdit?.email || ''}">
                </div>
                 <div class="form-group">
                    <label for="studentPhone">ফোন</label>
                    <input type="tel" id="studentPhone" value="${studentToEdit?.phone || ''}">
                </div>
                 <div class="form-group">
                    <label for="studentFacebookId">ফেসবুক আইডি/লিংক</label>
                    <input type="text" id="studentFacebookId" value="${studentToEdit?.facebookId || ''}">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-gray" id="cancelStudentForm">বাতিল</button>
                    <button type="submit" class="btn btn-primary">${studentToEdit ? ICONS.edit : ICONS.userCheck} ${studentToEdit ? 'আপডেট করুন' : 'তথ্য যোগ করুন'}</button>
                </div>
            </form>`;
        openModal(formModalContainer);

        document.getElementById('studentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const studentData = {
                name: document.getElementById('studentName').value,
                fatherName: document.getElementById('studentFatherName').value,
                roll: document.getElementById('studentRoll').value,
                reg: document.getElementById('studentReg').value,
                bio: document.getElementById('studentBio').value,
                imageUrl: document.getElementById('studentImageUrl').value,
                email: document.getElementById('studentEmail').value,
                phone: document.getElementById('studentPhone').value,
                facebookId: document.getElementById('studentFacebookId').value,
            };

            if (!studentData.name || !studentData.fatherName || !studentData.roll || !studentData.reg) {
                alert("অনুগ্রহ করে সকল আবশ্যকীয় (*) ঘর পূরণ করুন।");
                return;
            }

            let students = getData('students');
            if (currentEditingStudentId) {
                students = students.map(s => s.id === currentEditingStudentId ? {...s, ...studentData} : s);
            } else {
                students.push({...studentData, id: generateId()});
            }
            setData('students', students);
            closeModal(formModalContainer);
            renderStudentInfoPage();
        });
        document.getElementById('cancelStudentForm').addEventListener('click', () => closeModal(formModalContainer));
    }

    function renderPlantInfoPage(filterCategory = 'সব গাছ', searchTerm = '') {
         pageContent.innerHTML = `
            <div class="page-header">
                <h2>গাছের তথ্য</h2>
                 <button id="addPlantBtn" class="btn btn-primary add-new-btn">${ICONS.plus} নতুন গাছের তথ্য</button>
            </div>
            <div class="filters-container">
                <input type="text" id="plantSearchInput" placeholder="গাছ খুঁজুন (নাম, বৈজ্ঞানিক নাম)..." value="${searchTerm}">
            </div>
            <div id="plantFilters" class="filters-container"></div>
            <div id="plantList" class="grid-container"></div>`;
        
        const plantFiltersEl = document.getElementById('plantFilters');
        plantFiltersEl.innerHTML = ''; // Clear old filters
        const categories = ['সব গাছ', ...plantCategoriesList.map(c => c.label)];
        categories.forEach(catLabel => {
            const catValue = catLabel === 'সব গাছ' ? 'সব গাছ' : plantCategoriesList.find(c => c.label === catLabel).value;
            const btn = document.createElement('button');
            btn.textContent = catLabel;
            if (catValue === filterCategory) btn.classList.add('active');
            btn.addEventListener('click', () => renderPlantInfoPage(catValue, document.getElementById('plantSearchInput').value));
            plantFiltersEl.appendChild(btn);
        });
        
        document.getElementById('plantSearchInput').addEventListener('input', (e) => {
             // Find current active category filter
            const activeCatButton = plantFiltersEl.querySelector('button.active');
            const activeCatValue = activeCatButton ? (activeCatButton.textContent === 'সব গাছ' ? 'সব গাছ' : plantCategoriesList.find(c => c.label === activeCatButton.textContent).value) : 'সব গাছ';
            renderPlantInfoPage(activeCatValue, e.target.value);
        });


        const plants = getData('plants');
        let filteredPlants = plants;

        if (filterCategory !== 'সব গাছ') {
            filteredPlants = filteredPlants.filter(p => p.category === filterCategory);
        }
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filteredPlants = filteredPlants.filter(p => 
                p.name.toLowerCase().includes(lowerSearchTerm) ||
                p.scientificName.toLowerCase().includes(lowerSearchTerm) ||
                (p.description && p.description.toLowerCase().includes(lowerSearchTerm))
            );
        }
        
        const plantListEl = document.getElementById('plantList');
        plantListEl.innerHTML = '';
        if (filteredPlants.length === 0) {
            plantListEl.innerHTML = '<p>এই ক্যাটাগরিতে কোনো গাছের তথ্য নেই অথবা আপনার সার্চের সাথে মেলেনি।</p>';
        } else {
            filteredPlants.forEach(plant => {
                const div = document.createElement('div');
                div.className = 'card plant-card'; // Added plant-card for specific styling
                div.innerHTML = `
                    <img src="${plant.imageUrl || `https://placehold.co/300x200/E0E0E0/888888?text=${encodeURIComponent(plant.name)}`}" alt="${plant.name}" onerror="this.src='https://placehold.co/300x200/E0E0E0/888888?text=${encodeURIComponent(plant.name)}';">
                    <div class="plant-details">
                        <h4 class="card-title">${plant.name}</h4>
                        <p class="card-text italic text-sm text-gray-600">${plant.scientificName}</p>
                        <p class="card-text text-sm">${plant.description.substring(0,100)}${plant.description.length > 100 ? '...' : ''}</p>
                        <p class="card-text text-xs"><strong>উচ্চতা:</strong> ${plant.height || 'N/A'}, <strong>বয়স:</strong> ${plant.age || 'N/A'}</p>
                        <p class="card-text text-xs font-bold text-green-600">ক্যাটাগরি: ${getPlantCategoryLabel(plant.category)}</p>
                        ${plant.createdBy ? `<p class="text-xs text-gray-500">যোগ করেছেন: ${plant.createdBy}</p>` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-info btn-sm details-btn">${ICONS.info} বিস্তারিত</button>
                        <button class="btn btn-danger btn-sm delete-btn">${ICONS.trash} মুছুন</button> 
                    </div>`;
                div.querySelector('.details-btn').addEventListener('click', () => showDetails(plant, 'plant'));
                div.querySelector('.delete-btn').addEventListener('click', () => {
                    if (confirm('আপনি কি এই গাছের তথ্য মুছে ফেলতে চান?')) {
                        const updatedPlants = getData('plants').filter(p => p.id !== plant.id);
                        setData('plants', updatedPlants);
                        renderPlantInfoPage(filterCategory, searchTerm);
                    }
                });
                plantListEl.appendChild(div);
            });
        }
        document.getElementById('addPlantBtn').addEventListener('click', showPlantForm);
    }

    function showPlantForm() {
        formModalBody.innerHTML = `
            <h3>নতুন গাছের তথ্য যোগ করুন</h3>
            <form id="plantForm">
                <div class="form-group">
                    <label for="plantName">গাছের নাম <span class="text-red-600">*</span></label>
                    <input type="text" id="plantName" required>
                </div>
                <div class="form-group">
                    <label for="plantScientificName">বৈজ্ঞানিক নাম <span class="text-red-600">*</span></label>
                    <input type="text" id="plantScientificName" required>
                </div>
                <div class="form-group">
                    <label for="plantCategory">ক্যাটাগরি <span class="text-red-600">*</span></label>
                    <select id="plantCategory" required>
                        <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                        ${plantCategoriesList.map(cat => `<option value="${cat.value}">${cat.label}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="plantDescription">বর্ণনা <span class="text-red-600">*</span></label>
                    <textarea id="plantDescription" required></textarea>
                </div>
                <div class="form-group">
                    <label for="plantHeight">উচ্চতা</label>
                    <input type="text" id="plantHeight">
                </div>
                <div class="form-group">
                    <label for="plantAge">বয়স</label>
                    <input type="text" id="plantAge">
                </div>
                <div class="form-group">
                    <label for="plantImageUrl">ছবির URL</label>
                    <input type="url" id="plantImageUrl" placeholder="https://example.com/image.jpg">
                </div>
                <div class="form-actions">
                     <button type="button" class="btn btn-gray" id="cancelPlantForm">বাতিল</button>
                    <button type="submit" class="btn btn-primary">তথ্য যোগ করুন</button>
                </div>
            </form>`;
        openModal(formModalContainer);

        document.getElementById('plantForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const newPlant = {
                id: generateId(),
                name: document.getElementById('plantName').value,
                scientificName: document.getElementById('plantScientificName').value,
                category: document.getElementById('plantCategory').value,
                description: document.getElementById('plantDescription').value,
                height: document.getElementById('plantHeight').value,
                age: document.getElementById('plantAge').value,
                imageUrl: document.getElementById('plantImageUrl').value,
                createdBy: entryUserDetails ? `${entryUserDetails.name} (রোল: ${entryUserDetails.roll})` : 'Unknown'
            };

             if (!newPlant.name || !newPlant.scientificName || !newPlant.category || !newPlant.description) {
                alert("অনুগ্রহ করে সকল আবশ্যকীয় (*) ঘর পূরণ করুন।");
                return;
            }

            const plants = getData('plants');
            plants.push(newPlant);
            setData('plants', plants);
            closeModal(formModalContainer);
            renderPlantInfoPage();
        });
        document.getElementById('cancelPlantForm').addEventListener('click', () => closeModal(formModalContainer));
    }


    // --- Navigation ---
    const navItems = [
        { id: 'home', label: 'হোম', icon: ICONS.home, render: renderHomePage },
        { id: 'class', label: 'ক্লাস', icon: ICONS.book, render: renderClassPage },
        { id: 'exam', label: 'পরীক্ষা', icon: ICONS.clipboard, render: renderExamPage },
        { id: 'notice', label: 'নোটিশ', icon: ICONS.bell, render: renderNoticePage },
        { id: 'studentInfo', label: 'ছাত্র', icon: ICONS.users, render: renderStudentInfoPage },
        { id: 'plantInfo', label: 'গাছ', icon: ICONS.leaf, render: renderPlantInfoPage }
    ];

    function renderNav() {
        navContainer.innerHTML = '';
        navItems.forEach(item => {
            const btn = document.createElement('button');
            btn.id = `nav-${item.id}`;
            btn.innerHTML = `${item.icon}<span>${item.label}</span>`;
            if (item.id === currentPage) btn.classList.add('active');
            btn.addEventListener('click', () => navigateTo(item.id));
            navContainer.appendChild(btn);
        });
    }

    function navigateTo(pageId) {
        currentPage = pageId;
        const page = navItems.find(item => item.id === pageId);
        if (page) {
            page.render();
            renderNav(); // Re-render nav to update active state
        }
    }


    // --- Entry Form ---
    function renderEntryForm() {
        entryFormContainer.innerHTML = `
            <div class="modal-content">
                <div class="entry-form-header">
                    ${ICONS.leaf}
                    <h2>উদ্ভিদবিদ্যা বিভাগে স্বাগতম</h2>
                    <p class="text-gray-600">অনুগ্রহ করে আপনার তথ্য প্রদান করে প্রবেশ করুন।</p>
                </div>
                <form id="studentEntryForm">
                    <div class="form-group">
                        <label for="entryName">আপনার নাম</label>
                        <input type="text" id="entryName" required>
                    </div>
                    <div class="form-group">
                        <label for="entryRoll">রোল নাম্বার</label>
                        <input type="text" id="entryRoll" required>
                    </div>
                    <div class="form-group">
                        <label for="entryReg">রেজিস্ট্রেশন (শেষ ৪ সংখ্যা)</label>
                        <input type="text" id="entryReg" maxlength="4" pattern="\\d{4}" title="অনুগ্রহ করে রেজিস্ট্রেশন নাম্বারের শেষ ৪টি সংখ্যা দিন।" required>
                    </div>
                    <p id="entryError" class="error-message" style="display:none;"></p>
                    <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">${ICONS.login} প্রবেশ করুন</button>
                </form>
            </div>`;

        const studentEntryForm = document.getElementById('studentEntryForm');
        const entryErrorEl = document.getElementById('entryError');

        studentEntryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('entryName').value.trim();
            const roll = document.getElementById('entryRoll').value.trim();
            const regLast4 = document.getElementById('entryReg').value.trim();

            if (!name || !roll || !regLast4) {
                entryErrorEl.textContent = 'সকল তথ্য পূরণ করুন।';
                entryErrorEl.style.display = 'block';
                return;
            }
            if (regLast4.length !== 4 || !/^\d{4}$/.test(regLast4)) {
                entryErrorEl.textContent = 'রেজিস্ট্রেশন নাম্বারের শেষ ৪টি সংখ্যা সঠিকভাবে দিন।';
                entryErrorEl.style.display = 'block';
                return;
            }
            entryErrorEl.style.display = 'none';

            entryUserDetails = { name, roll, regLast4 };
            localStorage.setItem('entryFormSubmitted', JSON.stringify(entryUserDetails));
            initializeAppUI();
        });
    }
    
    function initializeAppUI() {
        closeModal(entryFormContainer);
        appContainer.style.display = 'block';
        userWelcomeInfo.textContent = `স্বাগতম: ${entryUserDetails.name} (রোল: ${entryUserDetails.roll})`;
        renderNav();
        navigateTo('home'); // Default page
    }

    // --- Initial Load ---
    const storedUserDetails = localStorage.getItem('entryFormSubmitted');
    if (storedUserDetails) {
        entryUserDetails = JSON.parse(storedUserDetails);
        if (entryUserDetails && entryUserDetails.name && entryUserDetails.roll && entryUserDetails.regLast4) {
           initializeAppUI();
        } else { // Invalid data
            localStorage.removeItem('entryFormSubmitted');
            renderEntryForm();
            openModal(entryFormContainer);
        }
    } else {
        renderEntryForm();
        openModal(entryFormContainer);
    }
});