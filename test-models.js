const apiKey = 'AIzaSyAv9IeHKDtJjpfw9ur2fjZLwMFtkMabnyU';
(async () => {
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        console.log(data.models.map(m => m.name).join('\n'));
    } catch (e) {
        console.error("Test failed:", e);
    }
})();
