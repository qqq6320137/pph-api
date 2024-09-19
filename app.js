const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors');
const adminAuth = require("./middlewares/admin-auth");
const userAuth = require("./middlewares/user-auth");
require("dotenv").config();

const app = express();

app.use((res, req, next) => {
  req.cc = (err, status = 200) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 前台路由配置
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const categoriesRouter = require('./routes/categories');
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapters');
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');

// 后台接口路由配置
const adminArticlesRouter = require("./routes/admin/articles");
const adminCategoriesRouter = require("./routes/admin/category");
const adminSettingsRouter = require("./routes/admin/settings");
const adminUsersRouter = require("./routes/admin/users");
const adminCoursesRouter = require("./routes/admin/courses");
const adminChartsRouter = require("./routes/admin/charts");
const adminAuthRouter = require("./routes/admin/auth");
const articlesRouter = require('./routes/articles');
const likesRouter = require('./routes/likes');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS 跨域配置  指定的地址可以访问
// const corsOptions = {
//   origin: 'https://clwy.cn',
// }
const corsOptions = {
  origin: [
    'https://clwy.cn',
    'http://127.0.0.1:5500'
  ],
}
// CORS 跨域配置  cors()默认  origin: '*',所有地址可以访问
// app.use(cors());
app.use(cors(corsOptions));

//前台路由配置
app.use("/", indexRouter);
app.use('/users', userAuth, usersRouter);
app.use('/categories', categoriesRouter);
app.use('/courses', coursesRouter);
app.use('/chapters', chaptersRouter);
app.use('/articles', articlesRouter);
app.use('/settings', settingsRouter);
app.use('/search', searchRouter);
app.use('/auth', authRouter);
app.use('/likes', userAuth, likesRouter);

// 后台路由配置
app.use("/admin/articles", adminAuth, adminArticlesRouter);
app.use("/admin/categories", adminAuth, adminCategoriesRouter);
app.use("/admin/settings", adminAuth, adminSettingsRouter);
app.use("/admin/users", adminAuth, adminUsersRouter);
app.use("/admin/courses", adminAuth, adminCoursesRouter);
app.use("/admin/charts", adminAuth, adminChartsRouter);
app.use("/admin/auth", adminAuthRouter);
app.use("/admin/auth", adminAuthRouter);

module.exports = app;
