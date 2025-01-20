const fs = require("fs").promises;
const multer = require("multer");
const moment = require("moment");
// const uploads = multer({ dest: 'uploads/' })

const removeFile = async (fileName) => {
  var filePath = "./uploads/"

  try {
    await fs.unlink(filePath + fileName);
    return 'File deleted successfully';
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
}

const isEmptyOrNull = (value) => {
  if (value === "" || value === null || value === undefined || value === "null" || value === "undefined") {
    return true;
  }
  return false;
}
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      // callback(null,Config.image_path)
      callback(null, "./uploads/")
    },
    filename: function (req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      callback(null, file.fieldname + '-' + uniqueSuffix)
    }
  }),
  limits: {
    fileSize: (1024 * 1024) * 10,// 3MB,
    file: 10
  },
  fileFilter: function (req, file, callback) {
    if (file.mimetype != "image/png" && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      // not allow 
      callback(null, false)
    } else {
      callback(null, true)
    }
  }
})


// Generate a random code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};


const logError = async (
  controller = "user.list",
  message = "error message",
  res
) => {
  try {
    // Append the log message to the file (create the file if it doesn't exist)
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss"); // Use 'moment' for formatted timestamp
    const path = `./logs/${controller}.txt`;
    const logMessage = `[${timestamp}]  ${message}\n\n;`
    await fs.appendFile(path, logMessage);
  } catch (error) {
    console.error("Error writing to log file:", error, res);
  }
  res.status(500).send("Internal Server Error");
};


// const upload_multi= multer({ storage });

const upload_multi = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./uploads/");
    },
    filename: function (req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      callback(null, file.fieldname + '-' + uniqueSuffix);
    }
  }),
  limits: {
    fileSize: (1024 * 1024) * 50, // 3 MB
    file: 10
  },
  fileFilter: function (req, file, callback) {
    if (file.mimetype !== "image/png" && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      // not allow
      callback(null, false);
    } else {
      callback(null, true);
    }
  }
});


const upload_file = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./uploads/"); // Change the path as needed
    },
    filename: function (req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      callback(null, file.fieldname + '-' + uniqueSuffix)
    }
  }),
  limits: {
    fileSize: (1024 * 1024) * 50 // 10 MB, change as needed
  },
  fileFilter: function (req, file, callback) {

    if (file.mimetype != "application/pdf" && file.mimetype !== 'application/msword' && file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // not allow 
      callback(null, false)
    } else {
      callback(null, true)
    }

  }
});


const getPermissionByRoleMenu = (RoleName) => {
  var data = {
    IT: [
      {
        route: "home"
      },
      {
        route: "history"
      },
      {
        route: "value"
      },
      {
        route: "service-package"
      },
      {
        route: "vision"
      },
      {
        route: "leader"
      },
      {
        route: "post-news"
      },

      {
        route: "mission"
      },
      {
        route: "inbox-message"
      },
      {
        route: "book-page"
      },

      {
        route: "view-website"
      },
      {
        route: "post-create-page"
      },
      {
        route: "department"
      },
      {
        route: "user-page"
      },
      {
        route: "role-page"
      },
      {
        route: "post-create-page"
      },
      {
        route: "image-slide-show"
      },
      {
        route: "department"
      },
      {
        route: "administration-page"
      },

      {
        route: "account-page"
      },

      {
        route: "technical-page"
      },
      {
        route: "training"
      },
      {
        route: "marquee"
      },
      {
        route: "partner"
      },

      {
        route: "uploads"
      },

    ],
    Admin: [
      {
        route: "marquee"
      },
      {
        route: "history"
      },
       {
        route: "book-page"
      },
      {
        route: "inbox"
      },
      {
        route: "view-website"
      },
      {
        route: "post-create-page"
      },
      {
        route: "department"
      },
      {
        route: "post-create-page"
      },
      {
        route: "image-slide-show"
      },
      {
        route: "department"
      },
      {
        route: "administration-page"
      },

      {
        route: "account-page"
      },

      {
        route: "technical-page"
      },
      {
        route: "training"
      },

      {
        route: "partner"
      },
      

      {
        route: "uploads"
      },

    ],
    Director: [
      {
        route: "inbox"
      },
      {
        route: "user-page"
      },
      {
        route: "role-page"
      },
    ],

  };
  return data[RoleName];
};




module.exports = {
  logError,
  upload,
  isEmptyOrNull,
  upload_multi,
  removeFile,
  upload_file,
  getPermissionByRoleMenu,
}
