// Entity Configuration
// Defines the structure and properties for each entity type

export const EntityConfig = {
    students: {
        title: 'Students',
        subtitle: 'Manage student records and information',
        fields: [
            { key: 'id', label: 'ID', type: 'text', showInTable: true, required: false, sortable: true, editable: false },
            { key: 'firstName', label: 'First Name', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'lastName', label: 'Last Name', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'email', label: 'Email', type: 'email', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'enrollmentDate', label: 'Enrollment Date', type: 'date', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'major', label: 'Major', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'gpa', label: 'GPA', type: 'number', showInTable: true, required: false, sortable: true, editable: true, min: 0, max: 4, step: 0.01 }
        ]
    },
    courses: {
        title: 'Courses',
        subtitle: 'Manage course catalog and schedules',
        fields: [
            { key: 'id', label: 'ID', type: 'text', showInTable: true, required: false, sortable: true, editable: false },
            { key: 'courseCode', label: 'Course Code', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'courseName', label: 'Course Name', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'credits', label: 'Credits', type: 'number', showInTable: true, required: true, sortable: true, editable: true, min: 1, max: 6 },
            { key: 'department', label: 'Department', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'semester', label: 'Semester', type: 'select', showInTable: true, required: true, sortable: true, editable: true, options: ['Fall', 'Spring', 'Summer'] },
            { key: 'description', label: 'Description', type: 'textarea', showInTable: true, required: false, sortable: false, editable: true }
        ]
    },
    instructors: {
        title: 'Instructors',
        subtitle: 'Manage faculty and teaching staff',
        fields: [
            { key: 'id', label: 'ID', type: 'text', showInTable: true, required: false, sortable: true, editable: false },
            { key: 'firstName', label: 'First Name', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'lastName', label: 'Last Name', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'email', label: 'Email', type: 'email', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'department', label: 'Department', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'title', label: 'Title', type: 'select', showInTable: true, required: true, sortable: true, editable: true, options: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Teaching Assistant'] },
            { key: 'officeNumber', label: 'Office Number', type: 'text', showInTable: true, required: false, sortable: false, editable: true },
            { key: 'phone', label: 'Phone', type: 'tel', showInTable: false, required: false, sortable: false, editable: true }
        ]
    },
    employees: {
        title: 'Employees',
        subtitle: 'Manage administrative and support staff',
        fields: [
            { key: 'id', label: 'ID', type: 'text', showInTable: true, required: false, sortable: true, editable: false },
            { key: 'firstName', label: 'First Name', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'lastName', label: 'Last Name', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'email', label: 'Email', type: 'email', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'position', label: 'Position', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'department', label: 'Department', type: 'text', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'hireDate', label: 'Hire Date', type: 'date', showInTable: true, required: true, sortable: true, editable: true },
            { key: 'phone', label: 'Phone', type: 'tel', showInTable: false, required: false, sortable: false, editable: true }
        ]
    }
};