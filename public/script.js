const auditBtn = document.getElementById('auditBtn');

const config = {
    urls: [
        'https://www.soccerbet.rs/sr',
        'https://www.soccerbet.rs/sr/sportsko-kladjenje/fudbal/S',
        'https://www.soccerbet.rs/sr/lobi-sve',
        'https://www.soccerbet.rs/sr/brojevi-i-virtuali/srb_virt',
        'https://www.soccerbet.rs/sr/gambling-uzivo/srb_live',
    ],
    scanner: {
        device: 'mobile',
    },
    audit: ['seo']
}

auditBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/api/audit', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
        })
        const body = await response.json();
        console.log(body);
    }
    catch (error) {
        console.error(error);    
    }
});