<script>
    let files = null;
    let canvas;
    let ctx;
    let originalImage = null;
    
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageSrc = e.target.result;
            originalImage = imageSrc; 
            const img = new Image();
            img.onload = () => {
                canvas.width = 400; 
                canvas.height = (img.height / img.width) * 400; 
                ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = imageSrc;
        };
        reader.readAsDataURL(file);
    };
    
    const applyFilter = (filter) => {
        if (!canvas || !ctx || !originalImage) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        if (filter === 'original') {
            const img = new Image();
            img.onload = () => {
                canvas.width = 400; 
                canvas.height = (img.height / img.width) * 400; 
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = originalImage;
        } else {
            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];
                if (filter === 'sepia') {
                    data[i] = red * 0.393 + green * 0.769 + blue * 0.189;
                    data[i + 1] = red * 0.349 + green * 0.686 + blue * 0.168;
                    data[i + 2] = red * 0.272 + green * 0.534 + blue * 0.131;
                }
                else if (filter === 'black-and-white') {
                const avg = (red + green + blue) / 3;
                data[i] = avg;
                data[i + 1] = avg;
                 data[i + 2] = avg;
                }
                else if (filter === 'grayscale') {
                const avg = (red + green + blue) / 3;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }
    };
</script>

<header class="bg-white py-4 shadow-md sticky top-0 z-10">
    <div class="container mx-auto px-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold italic text- purple-200 ">Craftlab</h1>
        <a href="/" class="bg-purple-900 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Home</a>
    </div>
</header>

<form class="container mx-auto p-5" method="POST" enctype="multipart/form-data">                                   
    <label for="dropzone" class="mb-3 flex flex-col items-center justify-center w-full h-48 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-purple-50">
        <div class="flex flex-col items-center justify-center pt-4 pb-4">
            {#if files && files.length}
                <p class="text-sm text-purple-300 font-semibold">{files[0].name}</p>
            {:else}
                <svg class="w-8 h-8 mb-4 black-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                <p class="text-sm text-black-200 font-semibold">Click to upload</p>
            {/if}
        </div>
        <input bind:files name="image" id="dropzone" type="file" accept="image/png, image/jpeg" class="hidden" on:change={handleImageUpload} required/>
    </label>

    <div class="canvas-container mb-3">
        <canvas bind:this={canvas} style="max-width: 100%; height: auto;"></canvas> 
        {#if files && files.length}
            <div class="mt-2">
                <button type="button" on:click={() => applyFilter('original')} class="bg-purple-900 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Sepia</button>
                <button type="button" on:click={() => applyFilter('black-and-white')} class="bg-purple-900 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Black & White</button>
                <button type="button" on:click={() => applyFilter('sepia')} class="bg-purple-900 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Retro</button>
            </div>
        {:else}
            <p class="text-purple-800 font-italic bold mt-4">New Feature:Try Filters after inserting Image</p>
        {/if}
    </div>

    <div class="mb-3">
        <label for="username" class="block mb-2 text-sm font-medium text-gray-800">Username</label>
        <input name="username" id="username" type="text" class="bg-purple-50 border border-gray-700 text-gray-900 text-sm rounded-lg block w-full p-2.5" />
    </div>
    <div class="mb-3">
        <label for="content" class="block mb-2 text-sm font-medium text-gray-800">Content</label>
        <textarea name="content" id="content" class="bg-purple-50 border border-gray-700 text-gray-900 text-sm rounded-lg block w-full p-2.5"></textarea>
    </div>

    <button type="submit" class="mt-4 text-white bg-purple-900 hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5">Post</button>
</form>

<style>
    .canvas-container {
        position: relative;
    }
</style>