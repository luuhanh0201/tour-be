import generateRandomNumber from "../../utils/number.until.js";
import getInitials from "../../utils/string.until.js";
import { findTourByIdModel } from "../tours/tour.model.js";
import { getGuideProfileByIdModel, } from "../user/user.model.js";
import { createTourDepartureModel, findTourDepartureByCodeModel, getAllTourDepartureModel } from "./tourDepartures.model.js";

export const createTourDepartureService = async (payload = {}) => {
    const { tourId, guideId, departureCode, departureDay, departureTime, returnDay, returnTime, meetingPoint, meetingTime, driverName, driverPhone, vehicleInfo, currentParticipants, maxParticipants, status, notes } = payload;
    const existTour = await findTourByIdModel({ tourId })
    const start = new Date(departureDay);
    const end = new Date(returnDay);
    const day = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const night = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    const { durationDays, durationNights } = existTour.tour || {}
    // console.log(`Lịch trình: ${day} ngày ${night} đêm`)
    // console.log(`Tour: ${durationDays} ngày ${durationNights} đêm`)

    if (!existTour.exist) {
        const error = new Error("Tour không tồn tại");
        error.status = 404;
        error.name = "TOUR NOT FOUND";
        throw error
    }
    if (durationDays !== day || durationNights !== night) {
        const error = new Error(`Chú ý đây là tour ${durationDays} ngày ${durationNights} đêm, vui lòng kiểm tra lại thời gian khởi hành`);
        error.status = 404;
        error.name = "DEPARTURE_ERROR";
        throw error
    }
    const existGuide = await getGuideProfileByIdModel({ idGuide: guideId })
    if (guideId !== null) {
        if (!existGuide?.exist) {
            const error = new Error("Guide không tồn tại");
            error.status = 404;
            error.name = "GUIDE NOT FOUND";
            throw error
        }
        const { employmentStatus, workingStatus } = existGuide?.guideProfile || {}

        if (employmentStatus !== "active" || workingStatus !== "available") {
            const error = new Error("Hướng dẫn viên này đang bận hoặc đang trong thời gian nghỉ, vui lòng chọn người khác!");
            error.status = 404;
            error.name = "GUIDE NOT FOUND";
            throw error
        }
    }
    console.log(existGuide)
    // employmentStatus === active
    // workingStatus === available
    // console.log(typeof employmentStatus === "active")
    // console.log(typeof workingStatus === "available")


    let randomCode = getInitials("DU AN CA NHAN") + generateRandomNumber(5);
    const { exist } = await findTourDepartureByCodeModel(departureCode);
    let isCode = exist
    while (isCode) {
        randomCode = getInitials("DU AN CA NHAN") + generateRandomNumber(5);
        const res = await findTourDepartureByCodeModel(departureCode);
        isCode = res.exist
    }
    const newPayload = { ...payload, departureCode: randomCode }
    console.log(newPayload)
    const created = await createTourDepartureModel(newPayload);
    return created || null



    // console.log(payload)
    return {
        // guide: existGuide?.userProfile,
    }

}
export const getAllTourDepartureService = async (payload = {}) => {
    const { limit = 10, page = 1, q = "" } = payload
    const tours = await getAllTourDepartureModel({ page: page, limit: limit, q: q })
    return tours
}
export const updateTourDepartureService = async (payload = {}) => {

}