const express = require("express");
const { authVerify } = require("../middleware/authverify");
const {
    courseExistsVerify,
    instructorVerify,
    userEnrolledVerify,
} = require("../middleware/courseverify");
const { Instructor } = require("../models/user");
const logger = require("../logger");

const router = express.Router();

router.post(
    "/:id/announcement",
    [authVerify, instructorVerify, courseExistsVerify],
    async (req, res) => {
        const { title, content, files } = req.body;

        logger.info(
            `Creating new announcement ${title} for course ${req.params.id}`
        );

        let course = res.locals.course;

        course.announcements.push({
            title: title,
            content: content,
            files: files,
            publisher: res.locals.userId,
        });

        await course.save();

        res.status(200).send({ message: "Announcement created" });
    }
);

router.get(
    "/:id/announcement",
    [authVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        let course = res.locals.course;

        res.send(course.announcements);
    }
);

router.delete(
    "/:id/announcement",
    [authVerify, instructorVerify, courseExistsVerify],
    async (req, res) => {
        logger.info(
            `Deleting announcement ${req.body.announcementId} ` +
            `for course ${req.params.id}`
        );

        let course = res.locals.course;

        if (
            !course.announcements.find(
                (announcement) =>
                    announcement._id.toString() === req.body.announcementId
            )
        ) {
            return res.status(400).send({ error: "Announcement not found" });
        }

        course.announcements = course.announcements.filter(
            (announcement) =>
                announcement._id.toString() !== req.body.announcementId
        );

        await course.save();

        res.status(200).send({ message: "Announcement removed" });
    }
);

router.get(
    "/:id/announcement/:announcementId",
    [authVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        let course = res.locals.course;

        if (
            !course.announcements.find(
                (announcement) =>
                    announcement._id.toString() === req.params.announcementId
            )
        ) {
            return res.status(400).send({ error: "Announcement not found" });
        }

        let announcement = course.announcements.find(
            (announcement) =>
                announcement._id.toString() === req.params.announcementId
        );

        const publisher = await Instructor.findById(announcement.publisher);

        announcement = {
            _id: announcement._id,
            title: announcement.title,
            content: announcement.content,
            date: announcement.date,
            files: announcement.files,
            publisher: publisher.name,
        };

        res.send(announcement);
    }
);

module.exports = router;
