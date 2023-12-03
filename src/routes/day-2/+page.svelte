<script lang="ts">
    import {onMount} from "svelte";
	import SantaPop from "$lib/assets/santa-pop.json"
    import HappySantaJson from "$lib/assets/santa-happy.json"
    import SleepySantaJson from "$lib/assets/santa-sleep.json"
    import FarterSantaJson from "$lib/assets/santa-fart.json"
    import CookieImage from "$lib/assets/cookies.png"
	import lottie from 'lottie-web'
    import {Button} from "$lib/components/ui/button";

    let lottieSantaLeft;
    let lottieSantaRight;
    let lottieCounter;

    let counter = 0;
    $: animationToLoad = chooseAnimation(counter);
    $: prevAnimationToLoad = chooseAnimation(counter - 1);
    $: nextAnimationToLoad = chooseAnimation(counter + 1);

    const chooseAnimation = (curr: number) => {
	    if (curr >= 10) {
		    return HappySantaJson;
	    } else {
		    return SleepySantaJson;
	    }
    };

    const createAnimation = (compare?: unknown, current?: unknown) => {
	    let animationToUse;

	    if (counter === 0 || (compare === undefined && current === undefined)) {
		    animationToUse = SleepySantaJson;
	    } else {
		    animationToUse = compare;
	    }

	    if (compare !== current || counter === 0) {
		    lottie.destroy('counter');
		    lottie.loadAnimation({
			    container: lottieCounter,
			    animationData: animationToUse,
                name: 'counter',
			    loop: true,
			    autoplay: true
	    });
	    }
    };

    const buttonIncrementHandler = () => {
	    counter++;
	    createAnimation(nextAnimationToLoad, animationToLoad);
    };

    const buttonDecrementHandler = () => {
	    counter--;
	    createAnimation(prevAnimationToLoad, animationToLoad);
    };

    const buttonResetHandler = () => {
	    counter = 0;
        lottie.destroy('counter');
        const animation = lottie.loadAnimation({
            container: lottieCounter,
            name: 'counter',
            animationData: FarterSantaJson,
            loop: false,
            autoplay: true
        });
        animation.addEventListener('complete', () => {
            createAnimation();
        })
    };

    onMount(async () => {
	    lottie.loadAnimation({
		    container: lottieSantaLeft,
		    animationData: SantaPop,
		    loop: true,
		    autoplay: true
        });
	    lottie.loadAnimation({
		    container: lottieSantaRight,
		    animationData: SantaPop,
		    loop: true,
		    autoplay: true
	    });
        lottie.loadAnimation({
            container: lottieCounter,
            name: 'counter',
            animationData: animationToLoad,
            loop: true,
            autoplay: true
        });
    });
</script>


<div class="space-y-4">
    <div class="flex items-center justify-center gap-x-4">
        <div bind:this={lottieSantaLeft} class="w-20"></div>
        <h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl text-center">
            Santa Cookie Manager
        </h1>
        <div bind:this={lottieSantaRight} class="w-20"></div>
    </div>
    <div class="grid place-items-center gap-y-5">
        <section class="flex gap-1 items-center justify-center">
            Cookies Eaten: {counter}
            {#if counter > 0}
                <span>x</span>
                <img class="w-4 h-4" src={CookieImage} alt="cookies" />
                {#if counter >= 10}
                    <img class="w-4 h-4" src={CookieImage} alt="cookies" />
                {/if}
            {/if}
        </section>

        <section bind:this={lottieCounter} id="lottie" class="w-48 h-48 flex gap-4"></section>

        <section class="flex gap-2">
            <Button on:click={buttonIncrementHandler}> + Eat Cookie </Button>
            <Button variant={counter <= 0 ? 'outline': 'destructive'}
                    disabled={counter <= 0 ? true : false}
                    on:click={buttonDecrementHandler}> - Dump Cookie </Button>
            <Button on:click={buttonResetHandler}> Reset </Button>

        </section>
    </div>
</div>

