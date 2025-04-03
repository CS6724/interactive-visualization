original_diagram = {
  "type": "class",
  "classes": [
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.models.Student",
          "name": "Student",
          "package": "com.university.models",
          "style": "",         
          "generatedContent": "",
          "files": [],
          "isAbstract": False,
          "isInterface": False,
          "properties": [
              {
                  "name": "studentId",
                  "dataType": "int",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "name",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "email",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "dateOfBirth",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "address",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "phoneNumber",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "getStudentId",
                  "returnType": "int",
                  "annotations": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False,
                  "parameters": []

              },
              {
                  "name": "enrollCourse",
                  "returnType": "void",
                  "annotations": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False,
                  "parameters": [
                      {
                          "name": "courseId",
                          "dataType": "int",
                          "annotations": []
                      },
                      {
                          "name": "termId",
                          "dataType": "int",
                          "annotations": []
                      }
                  ]
              },
              {
                  "name": "updateProfile",
                  "returnType": "void",
                  "parameters": [
                      {
                          "annotations": [],
                          "name": "newEmail",
                          "dataType": "string"
                      },
                      {
                          "annotations": [],
                          "name": "newPhoneNumber",
                          "dataType": "string"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "viewGrades",
                  "returnType": "string",
                  "parameters": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ]
          
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.models.Course",
          "name": "Course",
          "files": [],
          "generatedContent":"",
          "package": "com.university.models",
          "properties": [
              {
                  "name": "courseId",
                  "dataType": "int",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "courseName",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "credits",
                  "dataType": "int",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "description",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "prerequisites",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "getCourseId",
                  "returnType": "int",
                  "parameters": [],
                  "annotations": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "getCredits",
                  "returnType": "int",
                  "annotations": [],
                  "parameters": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "addPrerequisite",
                  "annotations": [],
                  "returnType": "void",
                  "parameters": [
                      {
                          "name": "courseId",
                          "annotations": [],
                          "dataType": "int"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "getCourseDescription",
                  "returnType": "string",
                  "annotations": [],
                  "parameters": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False,
          "summary": "This class represents a course in the university system. It contains information about the course such as the course name, credits, description, and prerequisites. It also provides methods to get the course ID, credits, add prerequisites, and get the course description."
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.models.Professor",
          "name": "Professor",
          "files": [],
          "generatedContent":"",
          "package": "com.university.models",
          "properties": [
              {
                  "annotations": [],
                  "name": "professorId",
                  "dataType": "int",
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "name",
                  "annotations": [],
                  "dataType": "string",
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "department",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "email",
                  "annotations": [],
                  "dataType": "string",
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "phoneNumber",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "getProfessorId",
                  "returnType": "int",
                  "annotations": [],
                  "parameters": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "assignCourse",
                  "annotations": [],
                  "returnType": "void",
                  "parameters": [
                      {
                          "annotations": [],
                          "name": "courseId",
                          "dataType": "int"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "gradeStudent",
                  "annotations": [],
                  "returnType": "void",
                  "parameters": [
                      {
                          "annotations": [],
                          "name": "studentId",
                          "dataType": "int"
                      },
                      {
                          "annotations": [],
                          "name": "courseId",
                          "dataType": "int"
                      },
                      {
                          "annotations": [],
                          "name": "grade",
                          "dataType": "string"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "getTeachingSchedule",
                  "returnType": "string",
                  "annotations": [],
                  "parameters": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False,
          "summary": "This class represents a professor in the university system. It contains information about the professor such as the professor name, department, email, and phone number. It also provides methods to get the professor ID, assign a course, grade a student, and get the teaching schedule."
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.models.Enrollment",
          "name": "Enrollment",
          "files": [],
          "generatedContent":"",
          "package": "com.university.models",
          "properties": [
              {
                  "annotations": [],
                  "name": "enrollmentId",
                  "dataType": "int",
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "annotations": [],
                  "name": "studentId",
                  "dataType": "int",
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "annotations": [],
                  "name": "courseId",
                  "dataType": "int",
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "getEnrollmentId",
                  "returnType": "int",
                  "parameters": [],
                  "visibility": "public",
                  "annotations": [],
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "dropCourse",
                  "returnType": "void",
                  "annotations": [],
                  "parameters": [
                      {
                          "name": "courseId",
                          "dataType": "int",
                          "annotations": []
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.models.Department",
          "name": "Department",
          "files": [],
          "generatedContent":"",
          "package": "com.university.models",
          "properties": [
              {
                  "name": "departmentId",
                  "dataType": "int",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "name",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "getDepartmentId",
                  "returnType": "int",
                  "annotations": [],
                  "parameters": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.users.Admin",
          "name": "Admin",
          "files": [],
          "generatedContent":"",
          "package": "com.university.users",
          "properties": [
              {
                  "name": "adminId",
                  "dataType": "int",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "name",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "manageUsers",
                  "returnType": "void",
                  "annotations": [],
                  "parameters": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.services.LibrarySystem",
          "name": "LibrarySystem",
          "files": [],
          "generatedContent":"",
          "package": "com.university.services",
          "properties": [
              {
                  "name": "libraryId",
                  "dataType": "int",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "bookCount",
                  "dataType": "int",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "booksAvailable",
                  "dataType": "int",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "checkoutBook",
                  "returnType": "void",
                  "annotations": [],
                  "parameters": [
                      {
                          "name": "bookId",
                          "annotations": [],
                          "dataType": "int"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "returnBook",
                  "returnType": "void",
                  "annotations": [],
                  "parameters": [
                      {
                          "name": "bookId",
                          "annotations": [],
                          "dataType": "int"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "checkAvailability",
                  "returnType": "boolean",
                  "annotations": [],
                  "parameters": [
                      {
                          "name": "bookId",
                          "annotations": [],
                          "dataType": "int"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.academics.Grade",
          "name": "Grade",
          "files": [],
          "generatedContent":"",
          "package": "com.university.academics",
          "properties": [
              {
                  "name": "gradeId",
                  "dataType": "int",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "studentId",
                  "dataType": "int",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "courseId",
                  "dataType": "int",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "grade",
                  "dataType": "string",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "getGrade",
                  "returnType": "string",
                  "annotations": [],
                  "parameters": [],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.utils.NotificationService",
          "name": "NotificationService",
          "files": [],
          "generatedContent":"",
          "package": "com.university.utils",
          "properties": [
              {
                  "name": "notificationId",
                  "annotations": [],
                  "dataType": "int",
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": True
              }
          ],
          "methods": [
              {
                  "name": "sendNotification",
                  "returnType": "void",
                  "parameters": [
                      {
                          "name": "message",
                          "annotations": [],
                          "dataType": "string"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.users.StudentAffairs",
          "name": "StudentAffairs",
          "files": [],
          "generatedContent":"",
          "package": "com.university.users",
          "properties": [
              {
                  "name": "affairsId",
                  "dataType": "int",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "studentServices",
                  "dataType": "string",
                  "annotations": [],
                  "visibility": "private",
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "assistStudent",
                  "returnType": "void",
                  "annotations": [],
                  "parameters": [
                      {
                          "name": "studentId",
                          "annotations": [],
                          "dataType": "int"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.services.ExamSystem",
          "name": "ExamSystem",
          "files": [],
          "generatedContent":"",
          "package": "com.university.services",
          "properties": [
              {
                  "name": "examId",
                  "dataType": "int",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "examDate",
                  "dataType": "string",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "scheduleExam",
                  "returnType": "void",
                  "annotations": [],
                  "parameters": [
                      {
                          "name": "courseId",
                          "annotations": [],
                          "dataType": "int"
                      },
                      {
                          "name": "date",
                          "annotations": [],
                          "dataType": "string"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.finance.TuitionPayment",
          "name": "TuitionPayment",
          "files": [],
          "generatedContent":"",
          "package": "com.university.finance",
          "properties": [
              {
                  "name": "paymentId",
                  "dataType": "int",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "amount",
                  "dataType": "double",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "studentId",
                  "dataType": "int",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "processPayment",
                  "annotations": [],
                  "returnType": "void",
                  "parameters": [
                      {
                          "name": "amount",
                          "annotations": [],
                          "dataType": "double"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      },
      {
          "type": "class",
          "annotations": ["@Entity"],
          "id": "com.university.academics.Transcript",
          "name": "Transcript",
          "files": [],
          "generatedContent":"",
          "package": "com.university.academics",
          "properties": [
              {
                  "name": "transcriptId",
                  "dataType": "int",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": True
              },
              {
                  "name": "studentId",
                  "dataType": "int",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": False
              },
              {
                  "name": "courseGrades",
                  "dataType": "string",
                  "visibility": "private",
                  "annotations": [],
                  "isStatic": False,
                  "isFinal": False
              }
          ],
          "methods": [
              {
                  "name": "generateTranscript",
                  "returnType": "void",
                  "annotations": [],
                  "parameters": [
                      {
                          "name": "studentId",
                          "annotations": [],
                          "dataType": "int"
                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              },
              {
                  "name": "printTranscript",
                  "annotations": [],
                  "returnType": "void",
                  "parameters": [
                      {
                          "annotations": [],
                          "name": "format",
                          "dataType": "string"

                      }
                  ],
                  "visibility": "public",
                  "isStatic": False,
                  "isAbstract": False
              }
          ],
          "isAbstract": False,
          "isInterface": False
      }
  ],
  "relationships": [
      {
          "id": "1",
          "name": "has",
          "source": "com.university.models.Student",
          "target": "com.university.models.Enrollment",
          "type": "composition"
      },
      {
          "id": "2",
          "name": "offered",
          "source": "com.university.models.Course",
          "target": "com.university.models.Enrollment",
          "type": "composition"
      },
      {
          "id": "3",
          "name": "teaches",
          "source": "com.university.models.Professor",
          "target": "com.university.models.Course",
          "type": "composition"
      },
      {
          "id": "4",
          "name": "belongs to",
          "source": "com.university.models.Professor",
          "target": "com.university.models.Department",
          "type": "association"
      },
      {
          "id": "5",
          "name": "handles",
          "source": "com.university.services.LibrarySystem",
          "target": "com.university.users.Librarian",
          "type": "association"
      },
      {
          "id": "6",
          "name": "issues",
          "source": "com.university.academics.Grade",
          "target": "com.university.models.Student",
          "type": "association"
      },
      {
          "id": "7",
          "name": "notifies",
          "source": "com.university.utils.NotificationService",
          "target": "com.university.users.Admin",
          "type": "association"
      },
      {
          "id": "8",
          "name": "manages",
          "source": "com.university.users.StudentAffairs",
          "target": "com.university.models.Student",
          "type": "association"
      },
      {
          "id": "9",
          "name": "handles",
          "source": "com.university.services.ExamSystem",
          "target": "com.university.academics.Grade",
          "type": "association"
      },
      {
          "id": "10",
          "name": "pays",
          "source": "com.university.finance.TuitionPayment",
          "target": "com.university.models.Student",
          "type": "association"
      },
      {
          "id": "11",
          "name": "maintains",
          "source": "com.university.academics.Transcript",
          "target": "com.university.models.Student",
          "type": "association"
      },
      {
          "id": "12",
          "name": "requires",
          "source": "com.university.models.Course",
          "target": "com.university.academics.Exam",
          "type": "association"
      }
  ]
}

keycloak_data = {"type":"class","classes":[{"type":"class","annotations":[],"id":"org.freedesktop.dbus.spi.message.InputStreamMessageReader","domId":"","name":"InputStreamMessageReader","package":"org.freedesktop.dbus.spi.message","selected":False,"style":"","generatedContent":"","files":["federation/sssd/src/main/java/org/freedesktop/dbus/spi/message/InputStreamMessageReader.java"],"isAbstract":False,"isInterface":False,"properties":[{"name":"logger","dataType":"Logger","annotations":[],"visibility":"private","isStatic":False,"isFinal":True},{"name":"len","dataType":"int[]","annotations":[],"visibility":"private","isStatic":False,"isFinal":True},{"name":"buf","dataType":"byte[]","annotations":[],"visibility":"private","isStatic":False,"isFinal":True},{"name":"tbuf","dataType":"byte[]","annotations":[],"visibility":"private","isStatic":False,"isFinal":True},{"name":"inputChannel","dataType":"SocketChannel","annotations":[],"visibility":"private","isStatic":False,"isFinal":True},{"name":"header","dataType":"byte[]","annotations":[],"visibility":"private","isStatic":False,"isFinal":False},{"name":"body","dataType":"byte[]","annotations":[],"visibility":"private","isStatic":False,"isFinal":False}],"methods":[{"name":"readMessage","returnType":"Message","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]},{"name":"close","returnType":"void","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]},{"name":"isClosed","returnType":"boolean","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]}]},{"type":"class","annotations":[],"id":"org.freedesktop.dbus.spi.message.OutputStreamMessageWriter","domId":"","name":"OutputStreamMessageWriter","package":"org.freedesktop.dbus.spi.message","selected":False,"style":"","generatedContent":"","files":["federation/sssd/src/main/java/org/freedesktop/dbus/spi/message/OutputStreamMessageWriter.java"],"isAbstract":False,"isInterface":False,"properties":[{"name":"logger","dataType":"Logger","annotations":[],"visibility":"private","isStatic":False,"isFinal":True},{"name":"outputChannel","dataType":"SocketChannel","annotations":[],"visibility":"private","isStatic":False,"isFinal":False}],"methods":[{"name":"writeMessage","returnType":"void","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]},{"name":"close","returnType":"void","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]},{"name":"isClosed","returnType":"boolean","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]}]},{"type":"class","annotations":[],"id":"org.freedesktop.dbus.spi.message.IMessageWriter","domId":"","name":"IMessageWriter","package":"org.freedesktop.dbus.spi.message","selected":False,"style":"","generatedContent":"","files":["federation/sssd/src/main/java/org/freedesktop/dbus/spi/message/IMessageWriter.java"],"isAbstract":False,"isInterface":True,"properties":[],"methods":[{"name":"writeMessage","returnType":"void","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]},{"name":"isClosed","returnType":"boolean","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]}]},{"type":"class","annotations":[],"id":"org.freedesktop.dbus.spi.message.IMessageReader","domId":"","name":"IMessageReader","package":"org.freedesktop.dbus.spi.message","selected":False,"style":"","generatedContent":"","files":["federation/sssd/src/main/java/org/freedesktop/dbus/spi/message/IMessageReader.java"],"isAbstract":False,"isInterface":True,"properties":[],"methods":[{"name":"isClosed","returnType":"boolean","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]},{"name":"readMessage","returnType":"Message","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]}]},{"type":"class","annotations":[],"id":"org.freedesktop.dbus.spi.message.ISocketProvider","domId":"","name":"ISocketProvider","package":"org.freedesktop.dbus.spi.message","selected":False,"style":"","generatedContent":"","files":["federation/sssd/src/main/java/org/freedesktop/dbus/spi/message/ISocketProvider.java"],"isAbstract":False,"isInterface":True,"properties":[],"methods":[{"name":"createReader","returnType":"IMessageReader","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]},{"name":"createWriter","returnType":"IMessageWriter","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]},{"name":"setFileDescriptorSupport","returnType":"void","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]},{"name":"isFileDescriptorPassingSupported","returnType":"boolean","annotations":[],"visibility":"public","isStatic":False,"isAbstract":False,"parameters":[]}]}],"relationships":[{"id":"1155","name":"writeMessage","source":"org.freedesktop.dbus.spi.message.OutputStreamMessageWriter","target":"org.freedesktop.dbus.messages.Message","type":"association"},{"id":"12655","name":"readMessage","source":"org.freedesktop.dbus.spi.message.IMessageReader","target":"org.freedesktop.dbus.messages.Message","type":"association"},{"id":"24305","name":"readMessage","source":"org.freedesktop.dbus.spi.message.InputStreamMessageReader","target":"org.freedesktop.dbus.messages.Message","type":"association"},{"id":"26767","name":"createReader","source":"org.freedesktop.dbus.spi.message.ISocketProvider","target":"org.freedesktop.dbus.spi.message.IMessageReader","type":"association"},{"id":"26768","name":"createWriter","source":"org.freedesktop.dbus.spi.message.ISocketProvider","target":"org.freedesktop.dbus.spi.message.IMessageWriter","type":"association"},{"id":"26906","name":"has","source":"org.freedesktop.dbus.connections.transports.TransportConnection","target":"org.freedesktop.dbus.spi.message.IMessageWriter","type":"composition"},{"id":"26907","name":"has","source":"org.freedesktop.dbus.connections.transports.TransportConnection","target":"org.freedesktop.dbus.spi.message.IMessageReader","type":"composition"},{"id":"26908","name":"getWriter","source":"org.freedesktop.dbus.connections.transports.TransportConnection","target":"org.freedesktop.dbus.spi.message.IMessageWriter","type":"association"},{"id":"26909","name":"getReader","source":"org.freedesktop.dbus.connections.transports.TransportConnection","target":"org.freedesktop.dbus.spi.message.IMessageReader","type":"association"},{"id":"33539","name":"writeMessage","source":"org.freedesktop.dbus.spi.message.IMessageWriter","target":"org.freedesktop.dbus.messages.Message","type":"association"}]}