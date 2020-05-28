// Ideally a Login/Auth Model could be built using database

// For the moment, we pretend as the verification secret comes from the database

exports.getSecretForHeader = () => {
    // Dummy DB lookup 
    return process.env.JWT_SECRET;
}