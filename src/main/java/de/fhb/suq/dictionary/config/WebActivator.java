package de.fhb.suq.dictionary.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.View;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Max on 02.11.14.
 */
@Controller
public class WebActivator {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public View home() {
        return new View() {
            @Override
            public String getContentType() {
                return null;
            }

            @Override
            public void render(Map<String, ?> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
                response.sendRedirect("index.html");
            }
        };

    }
}