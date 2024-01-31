const { expectObject, expectString} = require('expect-to-be');

module.exports = request => (
    expectObject(request.user) ? request.user.id :
        expectString(request.user) || expectString(request.id) || expectString(request.userId) ? request.user :
            undefined
);
