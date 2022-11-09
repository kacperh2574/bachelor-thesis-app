class RoomReqSpec {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    filter() {
        const queryObj = { ...this.queryStr }; // deep copy of req.query object
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g, // basing on mongoose query selectors
            match => `$${match}`
        );
        // returns Promise
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt'); // by date ascending
        }
        return this;
    }
    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields); // query projection
        } else {
            this.query = this.query.select('-__v'); // excluding __v field
        }
        return this;
    }
    paginate() {
        const page = Number(this.queryStr.page) || 1;
        const limit = Number(this.queryStr.limit) || 5;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit); // skip specified amount of rooms, limit results to specified amount
        return this;
    }
}

module.exports = RoomReqSpec;
