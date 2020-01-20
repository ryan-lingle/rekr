const {
  SchemaDirectiveVisitor,
  AuthenticationError,
  ApolloError
} = require("apollo-server-express");
const Jwt = require("./jwt");

function UnconfirmedError(message) {
  return new ApolloError(message, "UNCONFIRMED");
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (src, args, { token, id, DB, ...context }, info) {
      if (!Jwt.verify(token, id)) {
        throw new AuthenticationError("unauthenticated");
      } else {
        const user = await DB.user.findByPk(id);
        if (!user.emailVerified) {
          throw new UnconfirmedError("Email Unconfirmed");
        } else {
          const result = await resolve.call(src, args, {id, DB, ...context}, info);
          return result;
        }
      }
    }
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve } = field;
    field.resolve = async function (src, args, { id, token, ...context }, info) {
      if ((src.id == id || src.userId == id) && Jwt.verify(token, id)) {
        if (resolve) return await resolve.call(null, src, {id, ...context});
        return src[info.fieldName];
      }
    }
  }
}

module.exports = { AuthenticationDirective, AuthorizationDirective };
