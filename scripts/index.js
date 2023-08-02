import { world, system } from "@minecraft/server";
import { ModalFormData, ActionFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((data) => {
    const item = data.itemStack
    const player = data.source
    if (item.typeId === 'minecraft:clock') {
        cosmeticsForm(player)
    }
})

function cosmeticsForm(player) {
    new ActionFormData()
        .title("§dCosmetics")
        .body("§dMade By TM Grant")
        .button("§eChat ranks\n§7[§dClick to change§7]")
        .button("§bEffects\n§7[§dClick to change§7]")
        .show(player).then((r) => {
            const button = r.selection
            if (button === 0) {
                chatRanksCosmetics(player)
            }
            if (button === 1) {
                effectsCosmetics(player)
            }
        })
}

async function chatRanksCosmetics(player) {
    const ranks = [];
    player.getTags().forEach((tag) => {
        if (tag.startsWith("perm:rank:")) {
            ranks.push(tag.replace("perm:rank:", ""))
        }
    })
    await new ModalFormData()
        .title("§dCosmetics")
        .dropdown("Select a tag to edit", ranks)
        .show(player).then((r) => {
            player.getTags().map((tag) => {
                if (tag.startsWith("rank:")) {
                    player.removeTag("rank:" + tag)
                    player.addTag(r.formValues[0])
                }
            })
        })
}

async function effectsCosmetics(player) {
    const effects = [];
    player.getTags().forEach((tag) => {
        if (tag.startsWith("perm:effect:")) {
            effects.push(tag.replace("perm:effect:", ""))
        }
    })
    await new ModalFormData()
        .title("Cosmetics")
        .dropdown("Select a tag to edit", effects)
        .show(player).then((r) => {
            player.getTags().map((tag) => {
                if (tag.startsWith("effect:")) {
                    player.removeTag("effect:" + tag)
                    player.addTag(r.formValues[0])
                }
            })
        })
}

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        player.getTags().map((tag) => {
            if (tag.startsWith("rank:")) {
                player.addTag("perm:" + tag)
            }
        })
        player.getTags().map((tag) => {
            if (tag.startsWith("effect:")) {
                player.addTag("perm:" + tag)
            }
        })
    }
})

/**
 * @param {Player} player 
 * @returns {String} String
 */
function getPlayerRanks(player) {
    player.getTags().map((tag) => {
        if (tag.startsWith("rank:")) {
            tag.replace("§k", "")
        }
    })
}

world.beforeEvents.chatSend.subscribe((data) => {
    const message = data.message
    const player = data.sender
    data.cancel = true;
    world.sendMessage(`§7[§r${getPlayerRanks(player)}§7] §e${player.name}: §f${message}`)
})
