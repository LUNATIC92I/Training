package ci.cyberpost.app

import ci.cyberpost.app.ui.components.articleStatusLabel
import ci.cyberpost.app.ui.components.levelColor
import ci.cyberpost.app.ui.theme.Cp
import org.junit.Assert.assertEquals
import org.junit.Test

class StatusMappingTest {
    @Test fun voyantsVertOrangeRouge() {
        assertEquals(Cp.Green, levelColor("green"))
        assertEquals(Cp.Orange, levelColor("orange"))
        assertEquals(Cp.Red, levelColor("red"))
        assertEquals(Cp.Orange, levelColor("uncertain"))
        assertEquals(Cp.Red, levelColor("expired"))
        assertEquals(Cp.Green, levelColor("published"))
    }

    @Test fun libellesFrancais() {
        assertEquals("Vérification nécessaire", articleStatusLabel("uncertain"))
        assertEquals("En attente de validation", articleStatusLabel("needs_review"))
        assertEquals("Publié", articleStatusLabel("published"))
    }
}
