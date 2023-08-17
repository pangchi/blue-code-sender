let owner_name = "MoNKeY"
let pw_a = "pw_a"
let pw_b = "pw_b"
let watchdog = 60
let INITIALISED = 0
let RUN = 1
//let TIMEOUT = watchdog
let NORMAL = 128
let DIM = 16
serial.writeLine("Started")
setled(NORMAL)
keyboard.startKeyboardService()
//power mode caused code not send correctly neither can power save
//https://github.com/microbit-foundation/pxt-microbit-v2-power
//power.fullPowerOn(FullPowerSource.A)
//power.fullPowerOn(FullPowerSource.B)
//power.lowPowerEnable(LowPowerEnable.Allow)

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    watchdog = 0
    clearScreen()
    if (getState() != RUN) {
        basic.showIcon(IconNames.No)
        return
    }
    basic.showString("<")
    serial.writeLine("Button A")
    //keyboard.sendString(pw_a + keyboard.keys(keyboard._Key.enter))
    sendString(pw_a)
    watchdog = 60
})

input.onButtonPressed(Button.B, function on_button_pressed_b() {
    watchdog = 0
    clearScreen()
    if (getState() != RUN) {
        basic.showIcon(IconNames.No)
        return
    }
    basic.showString(">")
    serial.writeLine("Button B")
    //keyboard.sendString(pw_b + keyboard.keys(keyboard._Key.enter))
    sendString(pw_b)
    watchdog = 60
})

keyboard.setStatusChangeHandler(function my_function() {
    serial.writeLine("Keyboard status changed")
    clearScreen()
    getState(true)
})

basic.forever(function on_forever() {
    if (watchdog > 0) {
        doLoop(getState())
    }
    /*else {
        basic.clearScreen()
        //power.lowPowerRequest(LowPowerMode.Wait)
    }*/
})


/*
//this background interferece with code send, disabled
control.inBackground(function on_in_background() {
    while (true) {
        if (watchdog > 0) {
            serial.writeNumber(watchdog)
            watchdog -= 1
        }
        else {
            //power.lowPowerRequest(LowPowerMode.Wait)
        }
        basic.pause(1000)
    }
})
*/

function sendString(st: string) {
    //keyboard.sendString("" + keyboard.modifiers(keyboard._Modifier.control) + keyboard.modifiers(keyboard._Modifier.alt) + keyboard.keys(keyboard._Key.delete))
    //basic.pause(1000)
    for (let i = 0; i < st.length; ++i) {
        keyboard.sendString(st[i])
        basic.pause(10)
    }
    keyboard.sendString(keyboard.keys(keyboard._Key.enter))
    basic.pause(2000)
}

function getState(print2: boolean = false): number {
    if (keyboard.isEnabled() == true) {
        if (print2 == true) {
            serial.writeLine("RUN")
        }
        return RUN
    } else {
        if (print2 == true) {
            serial.writeLine("INITIALISED")
        }
        return INITIALISED
    }
}

function doLoop(s: number) {
    if (s == INITIALISED) {
        dispInitialised()
    } else if (s == RUN) {
        dispRun()
    }
}

function dispInitialised() {
    if (getState() != INITIALISED) {
        return
    }
    basic.showString(owner_name)
}

function dispRun() {
    //  each action will recheck, else skop
    let a = []
    a[0] = basic.showIcon(IconNames.Chessboard)
    a[1] = basic.showIcon(IconNames.Diamond)
    a[2] = basic.showIcon(IconNames.SmallDiamond)
    a[3] = basic.showIcon(IconNames.SmallHeart)
    a[4] = basic.showIcon(IconNames.Heart)
    a[5] = basic.showNumber(input.temperature())
    for (let j = 0; j < a.length; j++) {
        if (getState() != RUN) {
            return
        }
        a[j]
    }
}

function clearScreen() {
    led.stopAnimation()
    setled(NORMAL)
    //watchdog = TIMEOUT
}

function setled(brightness: number) {
    led.setBrightness(brightness)
}
