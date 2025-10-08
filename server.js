// importing the required packages
const express = require('express');
const server = express();

require('dotenv').config();

// initializing and setting server up
server.use(express.static('public'));
server.use(express.json());



// getting request from clientside and sending data back from the fetch results
server.get('/resource/:Addr', (req, res) => {

    const user = req.params;

    fetch('https://geo.ipify.org/api/v2/country,city?apiKey='+ process.env.ACCESS_KEY +'&ipAddress=' + user.Addr)
        .then((reply) => reply.json())
            .then((ans) => {
                let data = {
                    ip: ans.ip,
                    location: ans.location,
                    isp: ans.isp
                };
             res.json(data);
            });
});

// local testing environment
if (process.env.NODE_ENV !== 'production') {
    server.listen(process.env.PORT || 0, () => {
        console.log(`Server running on port ${process.env.PORT || 0}`);
    });
}

// export app for vercel/production environment
export default server;


