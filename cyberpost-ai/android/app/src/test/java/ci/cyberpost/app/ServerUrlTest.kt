package ci.cyberpost.app

import ci.cyberpost.app.data.ServerUrl
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ServerUrlTest {
    @Test fun httpsParDefaut() {
        assertEquals(ServerUrl.Result.Valid("https://cyberpost.example.com/api/v1/"), ServerUrl.normalize("cyberpost.example.com", false))
        assertEquals(ServerUrl.Result.Valid("https://cyberpost.example.com/api/v1/"), ServerUrl.normalize(" https://cyberpost.example.com/api/v1/ ", false))
    }

    @Test fun httpRefuseSaufDeveloppementLocal() {
        assertTrue(ServerUrl.normalize("http://cyberpost.example.com", true) is ServerUrl.Result.Invalid)
        assertTrue(ServerUrl.normalize("http://10.0.2.2:8000", false) is ServerUrl.Result.Invalid)
        assertEquals(ServerUrl.Result.Valid("http://10.0.2.2:8000/api/v1/"), ServerUrl.normalize("http://10.0.2.2:8000", true))
    }

    @Test fun adressesInvalides() {
        assertTrue(ServerUrl.normalize("", false) is ServerUrl.Result.Invalid)
        assertTrue(ServerUrl.normalize("ftp://x.com", false) is ServerUrl.Result.Invalid)
        assertTrue(ServerUrl.normalize("https://", false) is ServerUrl.Result.Invalid)
    }
}
