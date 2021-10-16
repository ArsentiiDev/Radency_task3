const yup = require('yup');

 const userSchema = yup.object({
    nameTask: yup.string(),
    category: yup.string(),
    content: yup.string().max(50),
}) 


userSchema.validate()

module.exports = userSchema
