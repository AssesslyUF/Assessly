// POST /api/sync-courses
export const mockSyncCoursesResponse = {
  "courses_synced": 13,
  "courses": [
    {
      "id": 555100,
      "name": "CAI6108 - ML Engineering",
      "course_code": "CAI6108",
      "enrollments": [
        {
          "role": "StudentEnrollment",
          "enrollment_state": "active"
        }
      ]
    },
    {
      "id": 555100,
      "name": "CAI6108 - ML Engineering",
      "course_code": "CAI6108",
      "enrollments": [
        {
          "role": "StudentEnrollment",
          "enrollment_state": "active"
        }
      ]
    },
    {
      "id": 555100,
      "name": "CAI6108 - ML Engineering",
      "course_code": "CAI6108",
      "enrollments": [
        {
          "role": "StudentEnrollment",
          "enrollment_state": "active"
        }
      ]
    },
    {
      "id": 555100,
      "name": "CAI6108 - ML Engineering",
      "course_code": "CAI6108",
      "enrollments": [
        {
          "role": "StudentEnrollment",
          "enrollment_state": "active"
        }
      ]
    }
  ]
};

// GET /api/courses/{course_id}/quizzes
export const mockQuizzesResponse = {
  "quiz_count": 1,
  "quizzes": [
    {
      "id": 1582529,
      "title": "API TEST Mock Quiz",
      "description": "Practice quiz created via the Canvas API (safe to ignore).",
      "html_url": "https://ufl.instructure.com/courses/389226/quizzes/1582529",
      "question_count": 0,
      "points_possible": 0,
      "due_at": null,
      "published": false
    }
  ]
};

// GET /api/courses/{course_id}/files
export const mockFilesResponse = {
  "file_count": 1,
  "files": [
    {
      "id": 63265314,
      "folder_id": 6794316,
      "display_name": "0_Introduction_and_CourseOverview.pdf",
      "filename": "0_Introduction_and_CourseOverview.pdf",
      "content-type": "application/pdf",
      "url": "https://ufl.instructure.com/files/63265314/download?download_frd=1&verifier=th6QWGRXtjNiourZyexyOM2FX2n8lDFRmqNXYCy9",
      "size": 1887556,
      "created_at": "2021-01-12T22:15:59Z",
      "updated_at": "2021-10-20T16:41:21Z",
      "modified_at": "2021-01-12T22:15:59Z",
      "mime_class": "pdf"
    },
    {
      "id": 63265315,
      "folder_id": 6794316,
      "display_name": "0_Introduction_and_CourseOverview.pdf",
      "filename": "0_Introduction_and_CourseOverview.pdf",
      "content-type": "application/pdf",
      "url": "https://ufl.instructure.com/files/63265314/download?download_frd=1&verifier=th6QWGRXtjNiourZyexyOM2FX2n8lDFRmqNXYCy9",
      "size": 1887556,
      "created_at": "2021-01-12T22:15:59Z",
      "updated_at": "2021-10-20T16:41:21Z",
      "modified_at": "2021-01-12T22:15:59Z",
      "mime_class": "pdf"
    }
  ]
};

// GET /api/courses/{course_id}/quizzes/{quiz_id}/questions
export const mockQuestionsResponse = {
  "question_count": 1,
  "questions": [
    {
      "id": 23919174,
      "question_name": "Question",
      "question_text": "<p>What is the computational complexity?</p>",
      "question_type": "multiple_choice_question",
      "points_possible": 1.0,
      "answers": [
        { "id": 8940, "text": "O(1)", "weight": 0 },
        { "id": 5589, "text": "O(n^2)", "weight": 100 }
      ]
    }
  ]
};

// Generated quiz questions mock data
export const mockGeneratedQuizQuestions = {
  "question_count": 5,
  "questions": [
    {
      "spot_number": 1,
      "group": "Group 1",
      "question": "Question 1",
      "prompt": "Which of the following best describes Big-O notation?",
      "answer_choices": [
        "It gives the exact running time of an algorithm on a specific machine",
        "It represents the upper bound on an algorithm’s growth rate for large inputs",
        "It measures the minimum possible running time in all cases",
        "It only applies to constant-time algorithms"
      ]
    },
    {
      "spot_number": 2,
      "group": "Group 1",
      "question": "Question 2",
      "prompt": "What is the time complexity of binary search in a sorted array?",
      "answer_choices": [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(1)"
      ]
    },
    {
      "spot_number": 3,
      "group": "Group 1",
      "question": "Question 3",
      "prompt": "Which data structure uses the Last In, First Out (LIFO) principle?",
      "answer_choices": [
        "Queue",
        "Heap",
        "Stack",
        "Linked List"
      ]
    },
    {
      "spot_number": 4,
      "group": "Group 1",
      "question": "Question 4",
      "prompt": "Which of the following sorting algorithms typically has the best average-case time complexity?",
      "answer_choices": [
        "Bubble Sort",
        "Selection Sort",
        "Merge Sort",
        "Insertion Sort"
      ]
    },
    {
      "spot_number": 5,
      "group": "Group 1",
      "question": "Question 5",
      "prompt": "What does a hash table aim to provide in the average case?",
      "answer_choices": [
        "Constant-time lookup and insertion",
        "Sorted traversal without extra work",
        "Guaranteed worst-case O(1) for every operation",
        "Only sequential access to data"
      ]
    }
  ]
};
